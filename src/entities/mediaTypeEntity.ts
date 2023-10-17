export const mediaTypeEntity: { [key: string]: string }  = {
    "7735187d-318d-40f8-a42b-6ae39d160df3": "Image",
    "53ffb74b-0784-4b74-9e65-52748a350690": "Video",
    "820d4cc4-e23b-4842-a363-3cebb5e998bf": "Voice",
}

export const getKeyByValueFromMediaTypeEntity = (value: string):string | undefined => {
    return Object.keys(mediaTypeEntity).find(key => mediaTypeEntity[key] === value);
}

export default mediaTypeEntity;