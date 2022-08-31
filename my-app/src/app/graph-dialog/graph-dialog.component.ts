import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DamageRelations } from 'src/Entities/DamageRelations';
import { Pokemon } from 'src/Entities/Pokemon';
import { PokemonInformation } from 'src/Entities/PokemonInformation';
import { CommunicationHelper } from '../CommunicationHelper';


@Component({
  selector: 'app-graph-dialog',
  templateUrl: './graph-dialog.component.html',
  styleUrls: ['./graph-dialog.component.css']
})
export class GraphDialogComponent implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) public data: Pokemon, private http: HttpClient) { }

  ngOnInit(): void {
    const typeHelper = new CommunicationHelper()



    this.data.pokeTypes.forEach(element => {
      typeHelper.getEffectivity(element, this.http).then((damageRelations: DamageRelations) => {

        console.log(damageRelations)

      }


      )
    })


  }





  displayTypes() {



    let typeString = "";
    this.data.pokeTypes.forEach(element => {
      typeString != "" ? typeString = typeString + ", " + element.charAt(0).toUpperCase() + element.slice(1) : typeString = element.charAt(0).toUpperCase() + element.slice(1)




    });

    return typeString;




  }




}




