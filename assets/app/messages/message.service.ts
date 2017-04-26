//import the model
import { Http, Response, Headers } from "@angular/http";
import { Injectable } from "@angular/core";
import { Message } from "./message.model";
import 'rxjs/Rx';
import { Observable } from 'rxjs';

@Injectable()
export class MessageService{
  private messages: Message[] = [];

  //only able to inject services into classes which have some form of metadeta attached to them
  constructor(private http: Http) {}

  addMessage(message: Message){
    this.messages.push(message);
    const body = JSON.stringify(message);
    const headers = new Headers ({'Content-Type': 'application/json'});
    //sends up an observable, does not send a request, holds the request
    return this.http.post('http://localhost:3000/message', body, {headers: headers})
      .map((response: Response) => response.json())
     .catch((error: Response) => Observable.throw(error.json()));
  }

  getMessages(){
    return this.http.get('http://localhost:3000/message')
      .map((response: Response) => {
        const messages = response.json().obj;

        let transformedMessages: Message[] = [];
        for (let message of messages) {
          transformedMessages.push(new Message(message.content, message.id, 'Dummy', null));
        }
        this.messages = transformedMessages;
        //subscribing to an Observable so map needs to return something
        return transformedMessages;
      })
    //  .catch((error: Response) => Observable.throw(error.json()));
  }

  deleteMessage(message: Message){
    this.messages.splice(this.messages.indexOf(message), 1)
  }
}
