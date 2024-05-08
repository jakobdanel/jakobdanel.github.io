var TravellingSalesman = /** @class */ (function () {
    function TravellingSalesman(points) {
        this.cities = points.features.map(function (feature) { return ({
            id: feature.properties["@id"],
            x: feature.geometry.coordinates[0],
            y: feature.geometry.coordinates[1]
        }); });
    }
    TravellingSalesman.prototype.euclideanDistance = function (a, b) {
        var dx = a.x - b.x;
        var dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    };
    TravellingSalesman.prototype.findNearestNeighbor = function (currentCity, remainingCities) {
        var minDistance = Infinity;
        var nearestNeighbor;
        for (var _i = 0, remainingCities_1 = remainingCities; _i < remainingCities_1.length; _i++) {
            var city = remainingCities_1[_i];
            var distance = this.euclideanDistance(currentCity, city);
            if (distance < minDistance) {
                minDistance = distance;
                nearestNeighbor = city;
            }
        }
        return nearestNeighbor;
    };
    TravellingSalesman.prototype.findNearestInsertion = function (currentTour) {
        var minIncrease = Infinity;
        var bestInsertedCity;
        var bestInsertPosition = -1;
        for (var _i = 0, _a = this.cities; _i < _a.length; _i++) {
            var city = _a[_i];
            if (!currentTour.includes(city)) {
                for (var i = 0; i < currentTour.length; i++) {
                    var prevCity = currentTour[i];
                    var nextCity = currentTour[(i + 1) % currentTour.length];
                    var increase = this.euclideanDistance(prevCity, city) + this.euclideanDistance(city, nextCity) - this.euclideanDistance(prevCity, nextCity);
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
    };
    TravellingSalesman.prototype.solve = function (startCityId) {
        var startCity = this.cities.find(function (city) { return city.id === startCityId; });
        if (!startCity)
            throw new Error("Start city not found");
        var remainingCities = this.cities.filter(function (city) { return city !== startCity; });
        var currentTour = [startCity];
        while (remainingCities.length > 0) {
            var _a = this.findNearestInsertion(currentTour), insertedCity = _a.insertedCity, position = _a.position;
            currentTour.splice(position, 0, insertedCity);
            remainingCities.splice(remainingCities.indexOf(insertedCity), 1);
        }
        return currentTour;
    };
    return TravellingSalesman;
}());
