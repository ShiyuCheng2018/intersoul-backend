export const  genderEntity: { [key: string]: string }  = {
    "198d6364-3357-4797-9988-7c3710d92bf2": "Male",
    "230f0c6b-0fd9-4887-b07f-6295e298a037": "Other",
    "2eb5fc98-11ab-46ce-adb3-6477a7cb9721": "Female"
}

export const getKeyByValueFromGenderEntity = (value: string):string | undefined => {
    return Object.keys(genderEntity).find(key => genderEntity[key] === value);
}

export default genderEntity;