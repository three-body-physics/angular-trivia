import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';



@Injectable()
export class TriviaApiService {

	difficulty:string;
	category: number;
	mode: string;
	format: string;
	amount: number;

  constructor(private http: HttpClient) { }


  getQuizes(query: any): Observable<any> {
  	return this.http.get(
  		`https://opentdb.com/api.php?amount=${query.amount}&category=${query.category}&difficulty=${query.difficulty}&type=${query.mode}&token=${query.token}`);
  }

  getCategories(): Observable<any> {
  	return this.http.get("https://opentdb.com/api_category.php");
  }

  getToken(): Observable<any> {
  	return this.http.get("https://opentdb.com/api_token.php?command=request");
  }

 
}
