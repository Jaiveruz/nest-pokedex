import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import axios, {AxiosInstance} from 'axios';

import { Pokereponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

    constructor (
    
        @InjectModel( Pokemon.name )
        private readonly pokemonModel: Model<Pokemon>,

        private readonly http: AxiosAdapter,

    ) {}


    async executeSeed() {
        const data = await this.http.get<Pokereponse>('https://pokeapi.co/api/v2/pokemon?limit=650')

        await this.pokemonModel.deleteMany({});   
        const pokemonsToInsert = data.results.map( ({ name, url }) => {
            const segments = url.split('/');
            const no:number = +segments[ segments.length - 2 ];
            return { name, no };
        });

        await this.pokemonModel.insertMany(pokemonsToInsert);

        return pokemonsToInsert;
    }

}
