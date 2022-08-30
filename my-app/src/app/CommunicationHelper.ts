import { HttpClient } from "@angular/common/http";
import { GenerationInformation } from "src/Entities/Generationinformation";
import { Pokemon } from "src/Entities/Pokemon";

export class CommunicationHelper {

    public getGeneration(id: number, http: HttpClient): Promise<Pokemon[]> {

        return new Promise((resolve, reject) => {
            const pokemonFromGeneration: Pokemon[] = [];

            http.get<any>(`https://pokeapi.co/api/v2/generation/${id}`).subscribe((data: any) => {
                const pokemonInGeneration: GenerationInformation[] = data.pokemon_species;
                let imageReceived: number = 0;

                pokemonInGeneration.forEach((pokemonFromApi: any) => {
                    const pokemonNameInUpperCase = pokemonFromApi.name.charAt(0).toUpperCase() + pokemonFromApi.name.slice(1);
                    this.getId(pokemonFromApi.url, http).then((id: number) => {
                        this.getImage(id, http).then((imageString: string) => {
                            const newPokemon = new Pokemon(id, pokemonNameInUpperCase, pokemonFromApi.url, imageString);
                            pokemonFromGeneration.push(newPokemon);
                            imageReceived = imageReceived + 1;

                            if (imageReceived == pokemonInGeneration.length)
                                resolve(pokemonFromGeneration);
                        })


                    }
                    )
                });


            })

        })
    }
    private getId(url: string, http: HttpClient): Promise<number> {
        return new Promise((resolve, reject) => {
            http.get<any>(url).subscribe((data: any) => {
                resolve(data.id);

            })
        })
    }
    private getImage(id: number, http: HttpClient): Promise<string> {
        return new Promise((resolve, reject) => {
            http.get<any>(`https://pokeapi.co/api/v2/pokemon/${id}/`).subscribe((data: any) => {
                resolve(data.sprites.other.home.front_default);
            })
        })
    }



}
