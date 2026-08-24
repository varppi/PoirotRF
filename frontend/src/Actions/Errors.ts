export class Error {
    Description: string;
    Action: string;
    TimeStamp: number;

    constructor(description: string, action: string, timeStamp: number) {
        this.Description = description;
        this.Action = action;
        this.TimeStamp = timeStamp;
    }
}