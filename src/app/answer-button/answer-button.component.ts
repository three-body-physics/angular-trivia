import { Component, OnInit, ViewEncapsulation, Input, Output, ElementRef, ViewChild, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-answer-button',
  templateUrl: './answer-button.component.html',
  styleUrls: ['./answer-button.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AnswerButtonComponent implements OnInit {

	@Input() myAnswer: string;
	@ViewChild("card") card;
	@Output() onTruth = new EventEmitter<string>();

	clicked: boolean = false; 

  constructor(private el: ElementRef) { }

  ngOnInit() {


  }



  confirmClick() {
  	
  	this.clicked = true;
  	this.onTruth.emit(this.myAnswer);

  }

  confirmAnswer(correctAns: string) {

  	if (correctAns == this.myAnswer) { 

  	this.card.nativeElement.style.background = "green"; 

  } else if ((correctAns !== this.myAnswer) && (this.clicked === true)) {

  	this.card.nativeElement.style.background = "red";

    }

  	setTimeout((() => { this.card.nativeElement.style.background = "white"; this.clicked = false; }), 1500);

  	}



  }


