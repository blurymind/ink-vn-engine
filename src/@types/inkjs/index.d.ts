declare module 'inkjs' {
    export class Choice {
        constructor()

        index?: number;
        text : string
        knot? : any;
        position?: any;
    }

    export class Story {
        constructor(jsonString : string)
        constructor(jsonString : string, lists : [])
    
        canContinue : boolean
        currentChoices : Choice[]
        currentTags : string[]
        currentText : string
        globalTags : string[]
        variablesState : VariablesState

        ChooseChoiceIndex(choiceIdx : number) : void;
        ChoosePathString(path : string) : void;
        Continue() : void
        ContinueMaximally() : void
    }

    export class Tag {
        constructor(tagText : string)

        text : string
    }

    export class VariablesState {
        $(variableName : string, value? : any) : any
    }
}
