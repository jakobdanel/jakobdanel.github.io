interface Point {
    id: string;
    x: number;
    y: number;
    [key: string]: any; // Additional properties
}

interface FeatureCollection {
    type: string;
    features: {
        type: string;
        geometry: {
            type: string;
            coordinates: number[];
        };
        properties: {
            [key: string]: any; // Additional properties
        };
    }[];
}

class TravellingSalesman {
    private cities: Point[];

    constructor(points: FeatureCollection) {
        this.cities = points.features.map(feature => ({
            id: feature.properties["@id"],
            x: feature.geometry.coordinates[0],
            y: feature.geometry.coordinates[1]
        }));
    }

    private euclideanDistance(a: Point, b: Point): number {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    private findNearestNeighbor(currentCity: Point, remainingCities: Point[]): Point {
        let minDistance = Infinity;
        let nearestNeighbor: Point | undefined;

        for (const city of remainingCities) {
            const distance = this.euclideanDistance(currentCity, city);
            if (distance < minDistance) {
                minDistance = distance;
                nearestNeighbor = city;
            }
        }

        return nearestNeighbor!;
    }

    private findNearestInsertion(currentTour: Point[]): { insertedCity: Point, position: number } {
        let minIncrease = Infinity;
        let bestInsertedCity: Point | undefined;
        let bestInsertPosition = -1;

        for (const city of this.cities) {
            if (!currentTour.includes(city)) {
                for (let i = 0; i < currentTour.length; i++) {
                    const prevCity = currentTour[i];
                    const nextCity = currentTour[(i + 1) % currentTour.length];
                    const increase = this.euclideanDistance(prevCity, city) + this.euclideanDistance(city, nextCity) - this.euclideanDistance(prevCity, nextCity);
                    if (increase < minIncrease) {
                        minIncrease = increase;
                        bestInsertedCity = city;
                        bestInsertPosition = i + 1; // Insert after prevCity
                    }
                }
            }
        }

        if (!bestInsertedCity) {
            throw new Error("No city can be inserted");
        }

        return { insertedCity: bestInsertedCity, position: bestInsertPosition };
    }

    public solve(startCityId: string): Point[] {
        const startCity = this.cities.find(city => city.id === startCityId);
        if (!startCity) throw new Error("Start city not found");

        const remainingCities = this.cities.filter(city => city !== startCity);
        let currentTour = [startCity];

        while (remainingCities.length > 0) {
            const { insertedCity, position } = this.findNearestInsertion(currentTour);
            currentTour.splice(position, 0, insertedCity);
            remainingCities.splice(remainingCities.indexOf(insertedCity), 1);
        }

        return currentTour;
    }
}