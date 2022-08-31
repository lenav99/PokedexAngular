import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Pokemon } from 'src/Entities/Pokemon';
import { PokemonInformation } from 'src/Entities/PokemonInformation';
import { CommunicationHelper } from './CommunicationHelper';
import { GraphDialogComponent } from './graph-dialog/graph-dialog.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {


  title = 'my-app';
  public pokemon: Pokemon[] = []
  constructor(private http: HttpClient, public dialog: MatDialog) {
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




    }).catch(() => {
      console.error("Error");
    })
  }



  displayTypes(pokemon: Pokemon) {


    let typeString = "";
    pokemon.pokeTypes.forEach(element => {
      typeString != "" ? typeString = typeString + ", " + element.charAt(0).toUpperCase() + element.slice(1) : typeString = element.charAt(0).toUpperCase() + element.slice(1)




    });

    return typeString;



  }



  openDialog(clickedPokemon: Pokemon) {
    this.dialog.open(GraphDialogComponent, {
      data: clickedPokemon
    });


  }


}




