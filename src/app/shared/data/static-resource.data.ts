export class StaticResourceData {
    private static goods = {
      // 0: 'Random',
      1: 'Coal',
      2: 'Grain',
      3: 'Iron',
      4: 'Wood',
      5: 'Boards',
      6: 'IronOre',
      7: 'Cotton',
      8: 'Textiles',
      9: 'Cattle',
      10: 'Meat',
      11: 'Thread',
      12: 'Hardware',
      13: 'Paper',
      14: 'Leather',
      15: 'Pastries',
      16: 'Flour',
      17: 'CopperOre',
      18: 'Quartz',
      19: 'Copper',
      20: 'Steel',
      21: 'Shoes',
      22: 'Glassware',
      23: 'Wires',
      24: 'Pipes',
      25: 'Packaging',
      26: 'Windows',
      27: 'SheetMetal',
      28: 'Silicon',
      29: 'Food',
      30: 'CrudeOil',
      31: 'Lamps',
      32: 'Chemicals',
      33: 'Clothing',
      34: 'StainlessSteel',
      35: 'Bauxite',
      36: 'Machinery',
      37: 'Plastics',
      38: 'Aluminium',
      39: 'Pottery',
      40: 'SteelBeams',
      41: 'Petrol',
      42: 'Cars',
      43: 'HouseholdSupplies',
      44: 'Electronics',
      45: 'Toys',
      46: 'SportsGoods',
      47: 'Toiletries',
      48: 'Pharmaceuticals',
      49: 'Passengers',
      // 50: 'Money',
    } as {[name: number]: string};

    static getResource(id: string|number) {
        return StaticResourceData.goods[+id];
    }

    static getResources() {
      return Object.keys(StaticResourceData.goods).map(id => {
        const resource = StaticResourceData.getResource(id);
        return {
          id: +id,
          name: resource
        };
      });
    }
}
