import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Pokemon } from 'src/Entities/Pokemon';
import { PokemonInformation } from 'src/Entities/PokemonInformation';
import { CommunicationHelper } from './CommunicationHelper';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {


  title = 'my-app';
  public pokemon: Pokemon[] = []
  constructor(private http: HttpClient) {
  }

  getGeneration(id: number) {
    this.pokemon.splice(0)
    const comHelper = new CommunicationHelper()
    comHelper.getGeneration(id, this.http).then((pokemon: Pokemon[]) => {
      pokemon.forEach(element => {

        this.pokemon.push(element);


      })
      this.pokemon.sort(function (a, b) {
        return a.pokeId - b.pokeId;
      });

      console.log(this.pokemon);


    }).catch(() => {
      console.error("Error");
    })
  }



  displayTypes(pokemon: Pokemon) {

    console.log(pokemon.pokeTypes)

    let typeString = "";
    pokemon.pokeTypes.forEach(element => {
      typeString != "" ? typeString = typeString + ", " + element.charAt(0).toUpperCase() + element.slice(1) : typeString = element.charAt(0).toUpperCase() + element.slice(1)




    });

    return typeString;



  }
}