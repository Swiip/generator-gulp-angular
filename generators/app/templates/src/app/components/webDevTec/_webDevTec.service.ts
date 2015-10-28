export interface ITecThing {
  rank: number;
  title: string;
  url: string;
  description: string;
  logo: string;
}

export class WebDevTecService {
  public data: ITecThing[];

  public get tec(): ITecThing[] {
    return this.data;
  }

  /** @ngInject */
  constructor () {
    var rawData = <%- technologies %>;

    this.data = rawData.map((awesomeThing: ITecThing) => {
      awesomeThing.rank = Math.random();
      return awesomeThing;
    });
  }
}
