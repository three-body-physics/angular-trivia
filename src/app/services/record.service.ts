import { Injectable } from '@angular/core';

@Injectable()
export class RecordService {

	private TotalQuestions: number;
	private username: string;
	private date: string;
	private timeTaken: number;
	private category: string;
	private difficulty: string;
	private corrects: number;
	private incorrects: number;
	private user: any = {

		username: "",
		
		record: {
						
			category: "",
			difficulty: "",
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
