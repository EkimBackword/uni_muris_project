import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.less']
})
export class ScheduleComponent implements OnInit {
  schedule: any[];
  week: string[];
  constructor() { }

  ngOnInit() {
    this.week = [
      'Понедельник',
      'Вторник',
      'Среда',
      'Четверг',
      'Пятница',
      'Суббота'
    ];
    this.schedule = [
      [
        null,
        {
          even: '2-103 БЖ Тималина  Е.Ю.',
          odd: '2-109 РЯиКР Дасько А.А.',
          base: null
        },
        {
          even: null,
          odd: null,
          base: '4-403 Иностранный язык Гаспарян Г.С.'
        },
        {
          even: '1-118 БЕЗОПАСНОСТЬ ЖИЗНЕДЕЯТЕЛЬНОСТИ (БЖ) доцент   Тималина  Е.Ю.',
          odd: '1-118 РУССКИЙ  ЯЗЫК  И  КУЛЬТУРА  РЕЧИ (РЯиКР) доцент  Дасько А.А.',
          base: null
        },
        null,
        null
      ],
      [
        {
          even: null,
          odd: null,
          base: '1-118 МАТЕМАТИЧЕСКИЙ АНАЛИЗ (МА) доцент Копылова Т.В.'
        },
        {
          even: null,
          odd: null,
          base: '2-310 МА	 Копылова Т.В.'
        },
        {
          even: null,
          odd: null,
          base: '4-317 История Король М.П.	'
        },
        {
          even: '1-122 ПРОГРАММИРОВАНИЕ НА ЯЗЫКЕ ВЫСОКОГО УРОВНЯ (ПЯВУ) доцент Сычев П.П.',
          odd: null,
          base: null
        },
        null,
        null
      ],
      [
        null,
        {
          even: '2-103 БЖ Тималина  Е.Ю.',
          odd: '2-109 РЯиКР Дасько А.А.',
          base: null
        },
        {
          even: null,
          odd: null,
          base: '4-403 Иностранный язык Гаспарян Г.С.'
        },
        {
          even: '1-118 БЕЗОПАСНОСТЬ ЖИЗНЕДЕЯТЕЛЬНОСТИ (БЖ) доцент   Тималина  Е.Ю.',
          odd: '1-118 РУССКИЙ  ЯЗЫК  И  КУЛЬТУРА  РЕЧИ (РЯиКР) доцент  Дасько А.А.',
          base: null
        },
        null,
        null
      ],
      [
        {
          even: null,
          odd: null,
          base: '1-118 МАТЕМАТИЧЕСКИЙ АНАЛИЗ (МА) доцент Копылова Т.В.'
        },
        {
          even: null,
          odd: null,
          base: '2-310 МА	 Копылова Т.В.'
        },
        {
          even: null,
          odd: null,
          base: '4-317 История Король М.П.	'
        },
        {
          even: '1-122 ПРОГРАММИРОВАНИЕ НА ЯЗЫКЕ ВЫСОКОГО УРОВНЯ (ПЯВУ) доцент Сычев П.П.',
          odd: null,
          base: null
        },
        null,
        null
      ],
      [
        null,
        {
          even: '2-103 БЖ Тималина  Е.Ю.',
          odd: '2-109 РЯиКР Дасько А.А.',
          base: null
        },
        {
          even: null,
          odd: null,
          base: '4-403 Иностранный язык Гаспарян Г.С.'
        },
        {
          even: '1-118 БЕЗОПАСНОСТЬ ЖИЗНЕДЕЯТЕЛЬНОСТИ (БЖ) доцент   Тималина  Е.Ю.',
          odd: '1-118 РУССКИЙ  ЯЗЫК  И  КУЛЬТУРА  РЕЧИ (РЯиКР) доцент  Дасько А.А.',
          base: null
        },
        null,
        null
      ],
      [
        {
          even: null,
          odd: null,
          base: '1-118 МАТЕМАТИЧЕСКИЙ АНАЛИЗ (МА) доцент Копылова Т.В.'
        },
        {
          even: null,
          odd: null,
          base: '2-310 МА	 Копылова Т.В.'
        },
        {
          even: null,
          odd: null,
          base: '4-317 История Король М.П.	'
        },
        {
          even: '1-122 ПРОГРАММИРОВАНИЕ НА ЯЗЫКЕ ВЫСОКОГО УРОВНЯ (ПЯВУ) доцент Сычев П.П.',
          odd: null,
          base: null
        },
        null,
        null
      ]
    ];
  }

}
