import Filter from './filter'

export default class OrbitHandler {
  constructor(Ipfs, OrbitDB) {
    this.OrbitDB = OrbitDB

    this.node = Ipfs('/ip4/127.0.0.1/tcp/5001');

    //this._init.bind(this);
    //this.addEvent.bind(this);

    this.openDB = {};
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

    let filter = new Filter()
                     .startDate(filters.startStr)
                     .endDate(filters.endStr)
                     .create();

    return this.openDB[loc].query(filter);
  }

  async addEvent(loc, newEvent) {
    await this._loadDB(loc);

    return await this.openDB[loc].put(newEvent);
  }

  async removeEvent(loc, id) {
    await this._loadDB(loc);

    return await this.openDB[loc].del(id);
  }

  async _loadDB(loc) {
    if(!this.initialized) {
      await this._init();
      this.initialized= true;
    }

    if(this.openDB[loc] === undefined) {
      let dbAddress = this.places.get(loc);
      let dbLoad = dbAddress ? this.OrbitDB.parseAddress(dbAddress) : loc;
      let locDB = await this.orbitdb.docstore(dbLoad);
      this.places.put(loc, locDB.address.toString());
      await locDB.load();
      this.openDB[loc] = locDB;
    }
  }
}
