import { TestBed, inject } from '@angular/core/testing';

import { TriviaApiService } from './trivia-api.service';

describe('TriviaApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TriviaApiService]
    });
  });

  it('should be created', inject([TriviaApiService], (service: TriviaApiService) => {
    expect(service).toBeTruthy();
  }));
});
