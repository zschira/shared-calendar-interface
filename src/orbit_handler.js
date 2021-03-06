import { Filter, Event } from './db-utils'

export default class OrbitHandler {
  constructor(Ipfs, OrbitDB) {
    this.OrbitDB = OrbitDB

    this.node = Ipfs('/ip4/127.0.0.1/tcp/5001');

    //this._init.bind(this);
    //this.addEvent.bind(this);

    this.eventsDB = {};
    this.resourcesDB = {};
    this.initialized = false;
  }

  async _init () {
    this.orbitdb = await this.OrbitDB.createInstance(await this.node);
 
    let address = await this.orbitdb.determineAddress('places', 'keyvalue');
    this.places = await this.orbitdb.keyvalue(address);
    await this.places.load();
  };

  async getEvents(loc, filters) {
    await this._loadDB(loc);

    const getResources = id => this.getResourcesByEvent(loc, id);

    let filter = new Filter()
                     .startDate(filters.startStr)
                     .endDate(filters.endStr)
                     .tags(filters.tags)
                     .create();

    return this.eventsDB[loc].get('').reduce((events, eventDoc) => {
      let event = new Event(eventDoc, getResources);
      if(filter(event)) {
        events.push(event.schemaView());
      }

      return events;
    }, []);
  }

  async addEvent(loc, newEvent) {
    await this._loadDB(loc);

    return await this.eventsDB[loc].put(newEvent);
  }

  async removeEvent(loc, id) {
    await this._loadDB(loc);

    return await this.eventsDB[loc].del(id);
  }

  async addResource(loc, newResource) {
    await this._loadDB(loc, true);

    return await this.resourcesDB[loc].put(newResource);
  }

  async getResources(loc, filters) {
    await this._loadDB(loc, true);

    return this.resourcesDB[loc].get('');
  }

  getResourcesByEvent(loc, id) {
    return this.resourcesDB[loc].query((resource) => resource.event === id);
  }

  async _loadDB(loc, resource=false) {
    if(!this.initialized) {
      await this._init();
      this.initialized= true;
    }

    let dbMap = resource ? this.resourcesDB : this.eventsDB;

    if(dbMap[loc] === undefined) {
      let dbAddress = this.places.get(loc);
      let events, resources;
      if(dbAddress !== undefined) {
        events = this.OrbitDB.parseAddress(dbAddress['events']);
        resources = this.OrbitDB.parseAddress(dbAddress['resources']);
      } else {
        events = loc + '/events';
        resources = loc + '/resources';
      }

      let eventDB = await this.orbitdb.docstore(events);
      let resourceDB = await this.orbitdb.docstore(resources);

      this.places.put(loc, {
        events: eventDB.address.toString(),
        resources: resourceDB.address.toString()
      });

      await eventDB.load();
      await resourceDB.load();

      this.eventsDB[loc] = eventDB;
      this.resourcesDB[loc] = resourceDB;
    }
  }
}
