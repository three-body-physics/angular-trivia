import { Component, OnInit, ViewEncapsulation, Input, Output, ElementRef } from '@angular/core';

@Component({
  selector: 'app-answer-button',
  templateUrl: './answer-button.component.html',
  styleUrls: ['./answer-button.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AnswerButtonComponent implements OnInit {

	@Input() myAnswer: string;

  constructor(private el: ElementRef) { }

  ngOnInit() {


  }

  confirmAnswer(correctAns: string) {

  	(correctAns == this.myAnswer) ? this.el.nativeElement.style.background = "green" : this.el.nativeElement.style.background = "red";

  	setTimeout((() => { this.el.nativeElement.style.background = "white"}), 1500);

  	}

  }

}
