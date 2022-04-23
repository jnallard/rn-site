
export interface CityDictionary {[id: string]: StaticCity};

export class StaticCity {

    constructor(public name: string, public id: string) {}
}

export class StaticCityData {
    public static AllCities = [
        new StaticCity('Hugston', '318d7429-1c80-4e10-b93d-abca948def4b'),
        new StaticCity('Blueville', 'd0546d4f-a3bf-4cdc-ac0a-61b1d12b8edc'),
        new StaticCity('Romsey', 'e6965a69-35de-48ab-b68f-2d986c5e5449'),
        new StaticCity('Bellham', 'c9179280-e8ba-4a8b-a991-73179bb8b7e3'),
        new StaticCity('Tuffington', 'e3804d69-9ded-4caf-9b5e-48d7397f192d'),
        new StaticCity('Maybury', 'ca95cb22-9695-425d-aae2-fa8f04eb0935'),
        new StaticCity('Stockport', '0351819e-b99f-4d8f-8b56-3f40311fbb41'),
        new StaticCity('Stamford', 'e4af32e1-3cd7-4045-8b8f-db1cd266869d'),
        new StaticCity('Kittsburg', '580e7238-d85d-4509-84fd-afe17043e224'),
        new StaticCity('Johnsboro', '269f7d62-dacc-4235-a1de-e96947a256b7'),
        new StaticCity('Longbridge', '92f0cb4c-3935-4a42-9eab-1464170f3930'),
        new StaticCity('Oakhill', 'e8cad559-c129-423f-b090-8bbb81ab9b5a'),
        new StaticCity('Camptown', '37f7bb46-8c15-41cc-afd8-191347234043'),
        new StaticCity('New Green', '2b19ba34-da2b-41d3-9a43-98e26268292f'),
        new StaticCity('Hartlefield', 'b17cbb39-cc3f-461e-94b1-03c62535f431'),
        new StaticCity('Liberty', 'b4f57fb2-16bc-441e-8ef5-51ccde0fd754'),
        new StaticCity('Rocksdale', '0e90992c-89f2-4214-a65c-449dfea72947'),
        new StaticCity('Chesterfield', 'e237c6fc-3381-4dab-bfc7-98c2670fba4c'),
        new StaticCity('Clock Haven', 'ada16292-4873-47b9-a636-ac848e2fa595'),
        new StaticCity('Branton', '1a0b7277-b509-4114-976a-327d4ff647f8'),
        new StaticCity('Lonkiln', 'fb4e9ebd-94bc-4846-869f-271f19950e48'),
        new StaticCity('Petertown', '1b6e0df4-fd19-4214-8caa-11a358291848'),
        new StaticCity('Oxbury', 'dafde448-57c9-4f05-90f4-80937abc0c85'),
        new StaticCity('Loncaster', '97a3d1df-0e3c-4713-b490-624a47f22928'),
        new StaticCity('Fort Crow', '059f6f8a-24d2-4f16-aab4-4416bdcf6f71'),
        new StaticCity('Dorry', '40377a1b-3129-4ce7-b508-e9df8f27505c'),
        new StaticCity('Stillwater', 'f5a66614-fb3b-4d45-a758-6c38364f7e66'),
        new StaticCity('Holdsworth', '16eec5b8-d634-47ec-94d9-81ac8973d22f'),
        new StaticCity('Bolcott', '5e21d461-24c5-4c65-a6e3-09fc942712e6'),
        new StaticCity('Courtville', 'bbc08b60-3b84-4efb-b38f-d0c9422afa67'),
        new StaticCity('New Cork', '5b1e2f4d-e337-4614-a05b-9fede31b7204'),
        new StaticCity('Wishington', '644f0d32-7040-4a8e-bc76-a46ddd5a5ef1'),
        new StaticCity('St. Niclas', '9218c94a-cdb8-4ffb-a294-0302fe1b4174'),
        new StaticCity('Westhill', 'aab36d1b-26a9-4bdf-be52-1ed36be0ff66'),
        new StaticCity('Pureshore', 'd941ae23-6d10-426f-aa70-360479d70018'),
        new StaticCity('Niceview', 'c7ef237d-fd7e-4663-8f9a-26e61d904365'),
        new StaticCity('Salt Springs', '26dda981-3569-41b3-a9aa-cbe3308683f8'),
        new StaticCity('Springville', 'e80ab342-35e5-4f57-a491-4a0b65f91c59'),
        new StaticCity('Eight Springs', 'c87dc54a-fdcf-401e-90be-8f75012ce9e0'),
        new StaticCity('Blarington', '06c44593-a409-40e5-960f-a29032d58d2b'),
        new StaticCity('Sandport', '3099f364-1087-4bee-821a-e9f5987262b5'),
        new StaticCity('Bluecreek', 'e9844bf8-b345-441e-8aa5-a43a848f4ce8'),
        new StaticCity('Millton', 'f43ff874-be03-422f-b3b5-a7e5d3d5959a'),
        new StaticCity('Starling', '4680996c-e011-44b6-83ac-60634ea9150e'),
        new StaticCity('Statenborough', 'ebd50c6e-f897-4fd1-b29d-7baccdd9b917'),
        new StaticCity('Oldtown', '6bc15b54-ad12-43ad-84f8-c1c40a13618f'),
        new StaticCity('Elsfield', '9d813aef-aa2f-4bdd-bf7a-9510c42c65a9'),
        new StaticCity('Archville', 'ef07f109-81bc-4f04-a185-7048a64fa984'),
        new StaticCity('Kirktown', 'a3671725-9c35-46f4-8d5e-7bac9190ee5a'),
        new StaticCity('Sleighton', '7b938cf0-5a00-4b8d-9cc1-5f8aeb27c0c8'),
    ];

    public static getCityDictionary() {
        let dict = {} as CityDictionary;
        this.AllCities.forEach((city) => dict[city.id] = city);
        return dict;
    }
}
