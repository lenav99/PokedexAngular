import { HttpClient } from "@angular/common/http";
import { DamageRelations } from "src/Entities/DamageRelations";
import { GenerationInformation } from "src/Entities/Generationinformation";
import { Pokemon } from "src/Entities/Pokemon";
import { PokemonInformation } from "src/Entities/PokemonInformation";

export class CommunicationHelper {

    /**
     * Die Methode liefert allgemeine Informationen zu einer bestimmten Generation. Die Generation wird dabei übergeben
     * @param id - ID der Generation (z.B. 1 = "Rot / Blau / Grün")
     * @param http - HTTP-Client für den Aufruf einer API 
     * @returns Promise<Pokemon> - Wird zurückgeliefert, sobald das "resolve()" durchaufen wurde. Als Daten wird ein Pokemon zurückgegeben
     */
    public getGeneration(id: number, http: HttpClient): Promise<Pokemon[]> {
        return new Promise((resolve, reject) => {
            const pokemonFromGeneration: Pokemon[] = [];

            //1) Die allgemeinen Generations-Informationen besorgen
            http.get<any>(`https://pokeapi.co/api/v2/generation/${id}`).subscribe((data: any) => {

                //Sobald die Informationen von der API zurückgegeben wurden ...
                const pokemonInGeneration: GenerationInformation[] = data.pokemon_species;
                let imageReceived: number = 0;

                //... wird über die Daten geloopt
                pokemonInGeneration.forEach((pokemonFromApi: any) => {
                    const pokemonNameInUpperCase = pokemonFromApi.name.charAt(0).toUpperCase() + pokemonFromApi.name.slice(1);
                    //Damit wird mehr Informationen zu einem Pokemon bekommen wird hier ein weiterer, asynchroner Request gemacht
                    //Dieser Request soll Informationen zu einem Pokemon zurückgeben. Aus diesem Grund steht hier in den Klammern bei 
                    //"then" PokeInformation. Dabeih handelt es sich um eine Entität, die alle möglichen Informationen zu bekommen hält.
                    this.getInformation(pokemonFromApi.url, http).then((pokemonInfo: PokemonInformation) => {
                        //Wenn die Informationen zu einem Pokemon ermittelt wurden wird ein weiterer, asynchroner Request abgeschickt
                        //der zu einem Pokemon (anhand der ID) ein Bild ermitteln soll.                        
                        this.getImage(pokemonInfo.pokeId, http).then((imageString: string) => {

                            //Sobald das Bild ermittelt wurde wird ein neues Pokemon-Objekt erzeugt. Dieses hält (bislang) die Attribute
                            //id, name, url, imageString sowie die Typen. Die ID sowie der Typ wurden vorher in der Methode "getInformation" ermittelt
                            //und werden jetzt hier mit den anderen Informationen (name, url, bildLink) zusammengeführt
                            const newPokemon = new Pokemon(pokemonInfo.pokeId, pokemonNameInUpperCase, pokemonFromApi.url, imageString, pokemonInfo.pokeTypes);
                            pokemonFromGeneration.push(newPokemon);

                            imageReceived = imageReceived + 1;

                            //An dieser Stelle wird geprüft, ob wir für alle Pokemon der jeweiligen Generation die Informationen ermittelt haben.
                            //Erst wenn diese alle ermittelt wurden (also für alle Pokemon), dann wird das Promise beendet und gesagt "Aufrufer: Führe dein Coding aus, dass bei .then() steht!"
                            if (imageReceived == pokemonInGeneration.length)
                                resolve(pokemonFromGeneration);
                        })
                    }
                    )
                });
            })

        })
    }


    private getInformation(url: string, http: HttpClient): Promise<PokemonInformation> {
        return new Promise((resolve, reject) => {
            //Im ersten Schritt wird hier anhand einer übergebenen URL Informationen zu dem Pokemon besorgt.
            //Konkret benötigen wir hier die ID eines Pokemon
            http.get<any>(url).subscribe((data: any) => {

                //Mit der ID können wir einen weiteren API-Call machen um uns Pokemon-Details zu einem bestimmten Pokemon
                //zu ermitteln
                http.get<any>(`https://pokeapi.co/api/v2/pokemon/${data.id}/`).subscribe((data: any) => {

                    //Zurück kommen viele Daten (data: any). Aus diesen Daten benötigen wir allerdings vorerst "nur" die Typen                    
                    const typeForPokemon: string[] = [];

                    //Hier wird über die Typen, die in den Daten aus der Api stehen geloopt und lediglich der Name des Typen in ein Array geschrieben
                    data.types.forEach((element: any) => {
                        typeForPokemon.push(element.type.name);
                    });

                    //Damit wir sowohl die ID als auch die Typen zurückliefern können muss hier ein neues Objekt erzeugt werden.
                    //Dieses Objekt enthält bislang die ID UND die Typen. 
                    resolve(new PokemonInformation(data.id, typeForPokemon));
                })
            })
        })
    }

    /**
     * Liefert die URL eines Bildes für ein bestimmtes Pokemon zurück
     * @param id - Pokemon, für dass das Bild ermittelt werden soll 
     * @param http - HttpClient
     * @returns - Link, unter dem das Bild gefunden wird
     */
    private getImage(id: number, http: HttpClient): Promise<string> {
        return new Promise((resolve, reject) => {
            http.get<any>(`https://pokeapi.co/api/v2/pokemon/${id}/`).subscribe((data: any) => {
                resolve(data.sprites.other.home.front_default);
            })
        })
    }


    getEffectivity(name: string, http: HttpClient): Promise<DamageRelations> {
        return new Promise((resolve, reject) => {
            http.get<any>(`https://pokeapi.co/api/v2/type/${name}/`).subscribe((data: any) => {

                const damageRelationsData = data.damage_relations

                const doubleDamageFrom: string[] = [];
                const doubleDamageTo: string[] = [];
                const halfDamageFrom: string[] = [];
                const halfDamageTo: string[] = [];
                const noDamgeFrom: string[] = [];
                const noDamageTo: string[] = [];


                damageRelationsData.double_damage_from.forEach((element: any) => {
                    doubleDamageFrom.push(element.name)
                });

                damageRelationsData.double_damage_to.forEach((element: any) => {
                    doubleDamageTo.push(element.name)
                });

                damageRelationsData.half_damage_from.forEach((element: any) => {
                    halfDamageFrom.push(element.name)
                });

                damageRelationsData.half_damage_to.forEach((element: any) => {
                    halfDamageTo.push(element.name)
                });

                damageRelationsData.no_damage_from.forEach((element: any) => {
                    noDamgeFrom.push(element.name)
                });

                damageRelationsData.no_damage_to.forEach((element: any) => {
                    noDamageTo.push(element.name)
                });


                const damageRelations = new DamageRelations(doubleDamageFrom, doubleDamageTo, halfDamageFrom, halfDamageTo, noDamgeFrom, noDamageTo)



                resolve(damageRelations);


            })


        })
    }

}
