import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Pokemon } from 'src/Entities/Pokemon';
import { PokemonInformation } from 'src/Entities/PokemonInformation';
import { CommunicationHelper } from './CommunicationHelper';
import { GraphDialogComponent } from './graph-dialog/graph-dialog.component';


import { ViewChild } from "@angular/core";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild("chart") chart: ChartComponent = {} as ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;




  title = 'my-app';
  public pokemon: Pokemon[] = []
  constructor(private http: HttpClient, public dialog: MatDialog) {

    this.chartOptions = {
      series: [
        {
          name: "My-series",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }
      ],
      chart: {
        height: 350,
        type: "bar"
      },
      title: {
        text: "My First Angular Chart"
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
      }
    };


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




