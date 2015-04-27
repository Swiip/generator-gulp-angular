module <%= appName %> {
  'use strict';

  export class Thing {
    public rank: number;
    public title: string;
    public url: string;
    public description: string;
    public logo: string;

    constructor(title: string, url: string, description: string, logo: string, rank: number) {
      this.title = title;
      this.url = url;
      this.description = description;
      this.logo = logo;
      this.rank = rank;
    }
  }

  export class WebDevTecService {
    public data: Thing[];
    public getTec() {
      return this.data;
    }

    /* @ngInject */
    constructor () {
      var that = this;
      that.data = new Array<Thing>();

      var rawData = <%= technologies %>;

      rawData.forEach(function(awesomeThing: Thing) {
        awesomeThing.rank = Math.random();
        that.data.push(awesomeThing);
      });
    }
  }

}
