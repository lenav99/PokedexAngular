import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DamageRelations } from 'src/Entities/DamageRelations';
import { Pokemon } from 'src/Entities/Pokemon';
import { PokemonInformation } from 'src/Entities/PokemonInformation';
import { CommunicationHelper } from '../CommunicationHelper';



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
  selector: 'app-graph-dialog',
  templateUrl: './graph-dialog.component.html',
  styleUrls: ['./graph-dialog.component.css']
})
export class GraphDialogComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent = {} as ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Pokemon, private http: HttpClient) {
    this.chartOptions = {
      series: [
        {
          name: "My-series",
          data: [2, 2, 0, 0, 1, 0, 2, 0, 0]
        },
        {
          name: "My-P",
          data: [2, 2, 0, 0, 1, 0, 2, 0, 0]
        }
      ],
      chart: {
        height: 350,
        width: 700,
        type: "bar",
        foreColor: "#FFFFFF",
      },
      title: {
        text: "My First Angular Chart"
      },
      xaxis: {
        categories: ["Normal", "Fire", "Water", "Grass", "Electric", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dark", "Dragon", "Steel", "Fairy"]
      }
    };
  }


  damageRelation: DamageRelations = {} as DamageRelations

  ngOnInit(): void {
    const typeHelper = new CommunicationHelper()

    const dataArray = [];
    this.data.pokeTypes.forEach(element => {
      typeHelper.getEffectivity(element, this.http).then((damageRelations: DamageRelations) => {

        console.log(damageRelations)
        this.damageRelation = damageRelations

        damageRelations.doubleDamageFrom.forEach(doubleDamageElement => {
          //TODO
        });

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




