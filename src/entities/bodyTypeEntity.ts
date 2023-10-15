export const bodyTypeEntity: { [key: string]: string }  = {
    "90c75738-ee11-45fd-81c1-231a6f2fa48e": "Slender",
    "56d076a1-0438-4557-8050-6ee93f6314ba": "Athletic",
    "138de358-bbff-4e61-a139-5f1dd8ba93d1": "Average",
    "cd35654c-a572-468d-b9ae-99e61cd8c291": "Curvy",
    "e6cbbd43-16a9-418d-b258-f961d85a9190": "Heavyset"
}

export const getKeyByValueFromBodyTypeEntity = (value: string):string | undefined => {
    return Object.keys(bodyTypeEntity).find(key => bodyTypeEntity[key] === value);
}

export default bodyTypeEntity;