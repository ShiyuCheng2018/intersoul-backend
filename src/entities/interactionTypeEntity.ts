export const interactionTypeEntity: { [key: string]: string } = {
    "366a793e-2c75-4ee0-b1db-5706559e3e66": "Like",
    "a3cedf50-30e3-4957-a41a-c7a4266c508d": "Dislike",
    "85d703ed-0e62-40ee-a504-0bff83fad19a": "Superlike",
    "b8a97ca4-0ceb-4edc-ac8f-4570a1ff1a4a": "Unmatched"
}

export const getKeyByValueFromInteractionTypeEntity = (value: string):string | undefined => {
    return Object.keys(interactionTypeEntity).find(key => interactionTypeEntity[key] === value);
}


