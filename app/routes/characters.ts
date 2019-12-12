import request from 'request';
export class Characters {
    
    static getChars(req: any, res: any) {
        request.get("https://rickandmortyapi.com/api/character/", (error, response, body) => {
            if (error) {
                res.json({
                    status: 500,
                    message: 'Servicio de personajes no disponible',
                });
                return console.dir(error);
            }
            console.dir(JSON.parse(body));
            const chars = JSON.parse(body);
            const newChars = [];
            for (const char of chars.results) {
                const newChar = {
                    name: char.name,
                    status: char.status,
                    species: char.species,
                    gender: char.gender,
                    image: char.image,
                }
                newChars.push(newChar);
            }
            res.json(newChars);
        });
    }
}