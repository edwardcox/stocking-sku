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
     * This is the primary measurement for initial size determination.
     * 
     * Size ranges for ankle circumference:
     * Size 1: 17-19 cm
     * Size 2: 19-21 cm
     * Size 3: 21-23 cm
     * Size 4: 23-25 cm
     * Size 5: 25-27 cm
     * Size 6: 27-29 cm
     * Size 7: 29-31 cm
     * Size 8: 30-33 cm
     * 
     * @param {number} ankle - Ankle circumference in cm
     * @returns {number} Initial size determination (1-8)
     * @throws {Error} If ankle measurement is out of valid range
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
     * 
     * Length ranges:
     * Petite: 62-71 cm
     * Normal: 72-83 cm
     * 
     * @param {number} legLength - Leg length measurement in cm
     * @returns {string} "Petite" or "Normal"
     * @throws {Error} If leg length is out of valid range
     */
    determineLengthType(legLength) {
        const length = parseFloat(legLength);
        if (isNaN(length)) {
            throw new Error("Invalid leg length measurement");
        }
        
        if (length >= 62 && length <= 71) return "Petite";
        if (length >= 72 && length <= 83) return "Normal";
        throw new Error("Leg length out of range.");
    }

    /**
     * Determines the two-digit style code based on length type and G+ status.
     * 
     * Style codes:
     * Thigh Length Normal: 69 (68 if G+)
     * Thigh Length Petite: 59 (58 if G+)
     * Knee Length Normal: 40
     * Knee Length Petite: 47
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
     * Calculates how far a measurement deviates from its acceptable range.
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
     * Calculates a detailed fit score for a measurement within a given range.
     * Used for resolving borderline cases.
     * 
     * Scoring system:
     * 3.0: Perfect fit (value is exactly in middle of range)
     * 2.0-3.0: Good fit (value is within range)
     * 1.0: Borderline fit (value is at min or max of range)
     * 0.0: Out of range
     */
    calculateFitScore(value, min, max) {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            return 0;
        }

        // Check if value is within range
        if (numValue > min && numValue < max) {
            // Calculate how centered the value is within the range
            const range = max - min;
            const middle = min + (range / 2);
            const distanceFromMiddle = Math.abs(numValue - middle);
            const normalizedDistance = 1 - (distanceFromMiddle / (range / 2));
            // Return score between 2 and 3 based on how centered the value is
            return 2 + normalizedDistance;
        }
        // Return 1 for values exactly at the boundaries
        if (numValue === min || numValue === max) {
            return 1;
        }
        // Return 0 for out of range values
        return 0;
    }

    /**
     * Calculates confidence score and provides detailed feedback about the fit.
     */
    calculateConfidenceScore(ankle, calf, thigh, legLength, size, lengthType) {
        try {
            // Input validation
            if (!size || !lengthType || !this.sizeLookupTable[lengthType]) {
                return {
                    score: 0,
                    message: "Unable to calculate confidence - invalid size or length type"
                };
            }

            const sizeData = this.sizeLookupTable[lengthType][size - 1];
            if (!sizeData) {
                return {
                    score: 0,
                    message: "Unable to calculate confidence - size data not found"
                };
            }
            // Ensure all measurements are valid numbers
            const measurements = {
                ankle: parseFloat(ankle),
                calf: parseFloat(calf),
                thigh: parseFloat(thigh),
                length: parseFloat(legLength)
            };

            // Check for any invalid numbers
            if (Object.values(measurements).some(isNaN)) {
                return {
                    score: 0,
                    message: "Unable to calculate confidence - invalid measurements"
                };
            }

            const deviations = {
                ankle: {
                    value: measurements.ankle,
                    deviation: this.calculateDeviation(measurements.ankle, sizeData.A_min, sizeData.A_max),
                    min: sizeData.A_min,
                    max: sizeData.A_max,
                    name: 'Ankle'
                },
                calf: {
                    value: measurements.calf,
                    deviation: this.calculateDeviation(measurements.calf, sizeData.B_min, sizeData.B_max),
                    min: sizeData.B_min,
                    max: sizeData.B_max,
                    name: 'Calf'
                },
                thigh: {
                    value: measurements.thigh,
                    deviation: this.calculateDeviation(measurements.thigh, sizeData.C_min, sizeData.C_max),
                    min: sizeData.C_min,
                    max: sizeData.C_max,
                    name: 'Thigh'
                },
                length: {
                    value: measurements.length,
                    deviation: this.calculateDeviation(measurements.length, sizeData.D_min, sizeData.D_max),
                    min: sizeData.D_min,
                    max: sizeData.D_max,
                    name: 'Length'
                }
            };

            // Get measurements sorted by deviation
            const sortedDeviations = Object.entries(deviations)
                .map(([key, data]) => ({
                    key,
                    ...data
                }))
                .sort((a, b) => b.deviation - a.deviation);
                // Generate improvement guidance
            const improvements = sortedDeviations
            .filter(d => d.deviation > 0)
            .map(d => {
                const { value, min, max, name } = d;
                if (value < min) {
                    return `${name} (${value.toFixed(1)}cm) is below the recommended range (${min}-${max}cm)`;
                } else if (value > max) {
                    return `${name} (${value.toFixed(1)}cm) is above the recommended range (${min}-${max}cm)`;
                }
                return null;
            })
            .filter(Boolean);

        const maxDeviation = Math.max(...sortedDeviations.map(d => d.deviation));
        
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

        return {
            score,
            message,
            deviations: sortedDeviations,
            improvements
        };
    } catch (error) {
        return {
            score: 0,
            message: "Error calculating confidence score",
            deviations: [],
            improvements: ["An error occurred while calculating measurements"]
        };
    }
}
/**
     * Core size determination function that considers all measurements.
     * Uses an enhanced approach for borderline cases.
     */
determineSize(ankle, calf, thigh, length, lengthType, stockingLength) {
    try {
        if (!this.sizeLookupTable[lengthType]) {
            throw new Error("Invalid leg length type.");
        }

        // Get potential sizes based on ankle measurement
        let potentialSizes = [];
        const ankleSize = this.determineInitialSize(ankle);
        
        // Handle borderline ankle measurements
        const isAnkleBorderline = parseFloat(ankle) % 1 === 0; // If ankle is exactly on a boundary
        
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
            const sizeData = this.sizeLookupTable[lengthType][sizeToCheck - 1];
            if (!sizeData) continue;
            
            // Use fit scores for secondary measurements
            const calfFit = this.calculateFitScore(calf, sizeData.B_min, sizeData.B_max);
            const thighFit = this.calculateFitScore(thigh, sizeData.C_min, sizeData.C_max);
            const lengthFit = this.calculateFitScore(length, sizeData.D_min, sizeData.D_max);

            // Calculate total fit score
            const totalFitScore = calfFit + thighFit + lengthFit;
            if (totalFitScore > bestScore) {
                bestScore = totalFitScore;
                bestFit = sizeToCheck;
                bestDeviations = {
                    ankle: this.calculateDeviation(ankle, sizeData.A_min, sizeData.A_max),
                    calf: this.calculateDeviation(calf, sizeData.B_min, sizeData.B_max),
                    thigh: this.calculateDeviation(thigh, sizeData.C_min, sizeData.C_max),
                    length: this.calculateDeviation(length, sizeData.D_min, sizeData.D_max)
                };

                // Check G+ condition
                isGPlus = (
                    stockingLength === "thigh_length" && 
                    parseFloat(thigh) > sizeData.C_max && 
                    parseFloat(thigh) >= sizeData.G_min && 
                    parseFloat(thigh) <= sizeData.G_max
                );
            }
        }

        if (bestFit !== null) {
            const confidenceResult = this.calculateConfidenceScore(
                ankle, calf, thigh, length, bestFit, lengthType
            );
            
            return { 
                size: bestFit, 
                confidence: confidenceResult.score,
                isGPlus: isGPlus,
                message: confidenceResult.message,
                improvements: confidenceResult.improvements || []
            };
        }

        throw new Error("No appropriate size found for these measurements.");
    } catch (error) {
        throw new Error(`Size determination error: ${error.message}`);
    }
}
/**
     * Generates the complete SKU code and returns comprehensive fitting information.
     */
generateSKU(length, color, toe, classType, ankle, calf, thigh, legLength) {
    try {
        // Validate inputs
        if (!["knee_length", "thigh_length"].includes(length)) {
            throw new Error("Invalid length specified.");
        }
        if (!["bronze", "black"].includes(color)) {
            throw new Error("Invalid color specified.");
        }
        if (!["open", "closed"].includes(toe)) {
            throw new Error("Invalid toe type specified.");
        }
        if (!["Class 1", "Class 2"].includes(classType)) {
            throw new Error("Invalid class specified.");
        }

        // Determine measurements and create SKU
        const legLengthType = this.determineLengthType(legLength);
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
            improvements: sizeData.improvements
        };
    } catch (error) {
        throw new Error(`SKU generation error: ${error.message}`);
    }
}
}

// Instead of export, make it globally available
window.SKUGenerator = SKUGenerator;