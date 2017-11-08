import { Injectable } from '@angular/core';

@Injectable()
export class RecordService {

	gameMode: string;
	TotalQuestion: number;
	username: string;
	date: string;
	timeTaken: number;
	category: string;
	difficulty: string;
	corrects: number;
	incorrects: number;
	user: any = {
		username: "",
		record: {
			gamemode: "",			
			category: "",
			difficulty: "",
			TotalQuestions: 0,
			corrects: 0,
			incorrects: 0,			
			timeTaken: 0,
			date: ""
		},
		achievements: []
	};


  constructor() { }


recordStats(context: any) {
	
}

}
