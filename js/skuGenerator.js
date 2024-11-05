// skuGenerator.js

/**
 * SKUGenerator Class
 * Handles the generation of SKU codes for medical compression stockings based on measurements and options.
 * 
 * SKU Format: XXYYZWV where:
 * XX = Class prefix (XA for Class 1, XB for Class 2)
 * YY = Style code based on length and leg type
 *      69 = Normal Thigh Length
 *      59 = Petite Thigh Length
 *      40 = Normal Knee Length
 *      47 = Petite Knee Length
 * Z = Color (6 for Bronze, 5 for Black)
 * W = Toe type (0 for Open, 1 for Closed)
 * V = Size (1-8)
 */
class SKUGenerator {
    constructor() {
        this.sizeLookupTable = sizeLookupTable;
    }

    /**
     * Determines initial size based on ankle measurement.
     */
    determineInitialSize(ankle) {
        // Convert to number and validate
        const ankleValue = parseFloat(ankle);
        if (isNaN(ankleValue)) {
            throw new Error("Invalid ankle measurement");
        }
        
        if (ankleValue >= 17 && ankleValue <= 19) return 1;
        if (ankleValue > 19 && ankleValue <= 21) return 2;
        if (ankleValue > 21 && ankleValue <= 23) return 3;
        if (ankleValue > 23 && ankleValue <= 25) return 4;
        if (ankleValue > 25 && ankleValue <= 27) return 5;
        if (ankleValue > 27 && ankleValue <= 29) return 6;
        if (ankleValue > 29 && ankleValue <= 31) return 7;
        if (ankleValue > 30 && ankleValue <= 33) return 8;
        throw new Error("Ankle circumference out of range.");
    }

    /**
     * Determines whether stocking should be Petite or Normal length.
     */
    /**
     * Determines whether stocking should be Petite or Normal length.
     * Different ranges for knee-length and thigh-length stockings.
     */
    determineLengthType(legLength, stockingLength) {
        const length = parseFloat(legLength);
        if (isNaN(length)) {
            throw new Error("Invalid leg length measurement");
        }
        
        if (stockingLength === "knee_length") {
            if (length >= 20 && length <= 38) return "Petite";
            if (length >= 39 && length <= 50) return "Normal";
            throw new Error("Knee length measurement out of range (20-50cm)");
        } else {
            // thigh_length
            if (length >= 62 && length <= 71) return "Petite";
            if (length >= 72 && length <= 95) return "Normal";  // Extended range
            throw new Error("Thigh length measurement out of range (62-95cm)");
        }
    }

    /**
     * Determines the two-digit style code.
     */
    determineStockingCode(length, legLengthType, isGPlus) {
        if (length === "thigh_length") {
            if (legLengthType === "Petite") {
                return isGPlus ? "58" : "59";
            } else {
                return isGPlus ? "68" : "69";
            }
        } else if (length === "knee_length") {
            return (legLengthType === "Petite") ? "47" : "40";
        }
        throw new Error("Invalid length specified.");
    }

    /**
     * Calculates deviation from range.
     */
    calculateDeviation(value, min, max) {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            throw new Error("Invalid measurement value");
        }
        
        if (numValue < min) return (min - numValue) / (max - min);
        if (numValue > max) return (numValue - max) / (max - min);
        return 0;
    }

    /**
     * Calculates fit score.
     */
    calculateFitScore(value, min, max) {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            return 0;
        }

        if (numValue > min && numValue < max) {
            const range = max - min;
            const middle = min + (range / 2);
            const distanceFromMiddle = Math.abs(numValue - middle);
            const normalizedDistance = 1 - (distanceFromMiddle / (range / 2));
            return 2 + normalizedDistance;
        }
        if (numValue === min || numValue === max) {
            return 1;
        }
        return 0;
    }

    /**
     * Calculates confidence score.
     */
    calculateConfidenceScore(ankle, calf, thigh, length, size, lengthType, stockingLength) {
        try {
            // Get the correct size data from lookup table
            const lookupTable = this.sizeLookupTable[stockingLength][lengthType];
            if (!lookupTable) {
                throw new Error("Invalid stocking type or length type");
            }

            const sizeData = lookupTable[size - 1];
            if (!sizeData) {
                throw new Error("Invalid size data");
            }

            // Calculate deviations
            const deviations = {
                ankle: {
                    value: parseFloat(ankle),
                    deviation: this.calculateDeviation(ankle, sizeData.A_min, sizeData.A_max),
                    min: sizeData.A_min,
                    max: sizeData.A_max,
                    name: 'Ankle'
                },
                calf: {
                    value: parseFloat(calf),
                    deviation: this.calculateDeviation(calf, sizeData.B_min, sizeData.B_max),
                    min: sizeData.B_min,
                    max: sizeData.B_max,
                    name: 'Calf'
                },
                length: {
                    value: parseFloat(length),
                    deviation: this.calculateDeviation(length, sizeData.D_min, sizeData.D_max),
                    min: sizeData.D_min,
                    max: sizeData.D_max,
                    name: 'Length'
                }
            };

            // Only include thigh measurements for thigh-length stockings
            if (stockingLength === "thigh_length") {
                deviations.thigh = {
                    value: parseFloat(thigh),
                    deviation: this.calculateDeviation(thigh, sizeData.C_min, sizeData.C_max),
                    min: sizeData.C_min,
                    max: sizeData.C_max,
                    name: 'Thigh'
                };
            }

            // Get maximum deviation
            const maxDeviation = Math.max(...Object.values(deviations).map(d => d.deviation));

            // Calculate score
            let score, message;
            if (maxDeviation === 0) {
                score = 100;
                message = "Perfect fit - all measurements fall exactly within ranges";
            } else if (maxDeviation <= 0.1) {
                score = 90;
                message = "Excellent fit - measurements within 10% deviation";
            } else if (maxDeviation <= 0.2) {
                score = 75;
                message = "Good fit - measurements within 20% deviation";
            } else if (maxDeviation <= 0.3) {
                score = 60;
                message = "Moderate fit - measurements within 30% deviation";
            } else if (maxDeviation <= 0.5) {
                score = 40;
                message = "Fair fit - measurements within 50% deviation";
            } else {
                score = 20;
                message = "Poor fit - measurements significantly outside ranges";
            }

            // Generate measurement analysis
            let analysis = "Measurement Analysis:\n";
            for (const [key, data] of Object.entries(deviations)) {
                const status = data.deviation === 0 ? "Perfect fit" :
                             data.deviation <= 0.1 ? "Excellent fit" :
                             data.deviation <= 0.2 ? "Good fit" :
                             data.deviation <= 0.3 ? "Moderate fit" :
                             "Needs attention";
                analysis += `${data.name}: ${data.value}cm (${status})\n`;
            }

            // Generate improvement suggestions
            const improvements = [];
            for (const data of Object.values(deviations)) {
                if (data.value < data.min) {
                    improvements.push(`${data.name} (${data.value.toFixed(1)}cm) is below the recommended range (${data.min}-${data.max}cm)`);
                } else if (data.value > data.max) {
                    improvements.push(`${data.name} (${data.value.toFixed(1)}cm) is above the recommended range (${data.min}-${data.max}cm)`);
                }
            }

            return {
                score,
                message,
                analysis,
                improvements,
                deviations: Object.values(deviations).sort((a, b) => b.deviation - a.deviation)
            };

        } catch (error) {
            console.error("Confidence calculation error:", error);
            return {
                score: 0,
                message: "Unable to calculate confidence - invalid parameters",
                analysis: "Unable to perform measurement analysis",
                improvements: ["Please check all measurements are entered correctly"],
                deviations: []
            };
        }
    }
    /**
     * Core size determination function.
     */
    determineSize(ankle, calf, thigh, length, lengthType, stockingLength) {
        try {
            if (!this.sizeLookupTable[stockingLength] || 
                !this.sizeLookupTable[stockingLength][lengthType]) {
                throw new Error(`Invalid combination: ${stockingLength} - ${lengthType}`);
            }

            const lookupTable = this.sizeLookupTable[stockingLength][lengthType];

            // Get potential sizes based on ankle measurement
            let potentialSizes = [];
            const ankleSize = this.determineInitialSize(ankle);
            
            // Handle borderline ankle measurements
            const isAnkleBorderline = parseFloat(ankle) % 1 === 0;
            
            if (isAnkleBorderline) {
                if (ankleSize > 1) potentialSizes.push(ankleSize - 1);
                potentialSizes.push(ankleSize);
                if (ankleSize < 8) potentialSizes.push(ankleSize + 1);
            } else {
                potentialSizes.push(ankleSize);
            }

            let bestFit = null;
            let bestScore = -Infinity;
            let bestDeviations = null;
            let isGPlus = false;

            // Evaluate each potential size
            for (const sizeToCheck of potentialSizes) {
                const sizeData = lookupTable[sizeToCheck - 1];
                if (!sizeData) continue;
                
                // Calculate base fit scores with weighted measurements
                const ankleFit = this.calculateFitScore(ankle, sizeData.A_min, sizeData.A_max) * 3; // Triple weight
                const calfFit = this.calculateFitScore(calf, sizeData.B_min, sizeData.B_max) * 2;   // Double weight
                const lengthFit = this.calculateFitScore(length, sizeData.D_min, sizeData.D_max);
                
                // Initialize total fit score with mandatory measurements
                let totalFitScore = ankleFit + calfFit + lengthFit;

                // Handle thigh measurements for thigh-length stockings only
                let thighFit = 0;
                if (stockingLength === "thigh_length") {
                    thighFit = this.calculateFitScore(thigh, sizeData.C_min, sizeData.C_max);
                    totalFitScore += thighFit;
                }

                if (totalFitScore > bestScore) {
                    bestScore = totalFitScore;
                    bestFit = sizeToCheck;
                    
                    // Build deviations object based on stocking type
                    bestDeviations = {
                        ankle: this.calculateDeviation(ankle, sizeData.A_min, sizeData.A_max),
                        calf: this.calculateDeviation(calf, sizeData.B_min, sizeData.B_max),
                        length: this.calculateDeviation(length, sizeData.D_min, sizeData.D_max)
                    };

                    // Only include thigh measurements for thigh-length stockings
                    if (stockingLength === "thigh_length") {
                        bestDeviations.thigh = this.calculateDeviation(thigh, sizeData.C_min, sizeData.C_max);
                        
                        // G+ determination only for thigh-length stockings
                        isGPlus = (
                            parseFloat(thigh) > sizeData.C_min && 
                            parseFloat(thigh) >= sizeData.G_min && 
                            parseFloat(thigh) <= sizeData.G_max
                        );
                    }
                }
            }

            if (bestFit === null) {
                throw new Error("No appropriate size found for these measurements.");
            }

            // Calculate final confidence score
            const confidenceResult = this.calculateConfidenceScore(
                ankle, calf, thigh, length, bestFit, lengthType, stockingLength
            );

            return {
                size: bestFit,
                confidence: confidenceResult.score,
                isGPlus: isGPlus,
                message: confidenceResult.message,
                improvements: confidenceResult.improvements || [],
                analysis: confidenceResult.analysis || ''
            };

        } catch (error) {
            console.error("Size determination error details:", error);
            throw new Error(`Size determination error: ${error.message}`);
        }
    }

    generateSKU(length, color, toe, classType, ankle, calf, thigh, legLength) {
        try {
            // ... existing validation code ...

            // Determine measurements and create SKU
            const legLengthType = this.determineLengthType(legLength, length);
            const sizeData = this.determineSize(ankle, calf, thigh, legLength, legLengthType, length);
            const stockingCode = this.determineStockingCode(length, legLengthType, sizeData.isGPlus);
            
            // Build SKU string
            let sku = classType === "Class 1" ? "XA" : "XB";
            sku += stockingCode;
            sku += color === "bronze" ? "6" : "5";
            sku += toe === "open" ? "0" : "1";
            sku += sizeData.size;

            return {
                sku,
                size: sizeData.size,
                isGPlus: sizeData.isGPlus,
                legLengthType,
                confidence: sizeData.confidence,
                message: sizeData.message,
                improvements: sizeData.improvements,
                analysis: sizeData.analysis
            };
        } catch (error) {
            throw new Error(`SKU generation error: ${error.message}`);
        }
    }
}

// Make SKUGenerator globally available
window.SKUGenerator = SKUGenerator;