# Stocking SKU Generator

## Overview
The Stocking SKU Generator is a web-based tool designed to generate unique SKU (Stock Keeping Unit) codes for medical compression stockings based on specific measurements and product options. This tool ensures accurate sizing and product specification for medical compression stockings.

## Purpose
This tool helps healthcare providers and medical supply professionals to:
- Determine the correct stocking size based on patient measurements
- Generate accurate SKU codes for ordering
- Validate measurements against established size ranges
- Ensure proper product specification

## SKU Structure
Each SKU is composed of several parts that encode specific product information:

```
Example SKU: XB69604
```

### SKU Breakdown:
1. **Class Prefix** (2 characters)
   - XA = Class 1 Compression
   - XB = Class 2 Compression

2. **Style Code** (2 digits)
   For Thigh Length:
   - 69 = Normal Length
   - 59 = Petite Length
   
   For Knee Length:
   - 40 = Normal Length
   - 47 = Petite Length

3. **Color** (1 digit)
   - 6 = Bronze
   - 5 = Black

4. **Toe Type** (1 digit)
   - 0 = Open
   - 1 = Closed

5. **Size** (1 digit)
   - Ranges from 1-8
   - May include "G+" designation in the results (but not in SKU)

## Measurement Rules

### Length Types
- **Petite**: Leg length 62-71 cm
- **Normal**: Leg length 72-83 cm

### Size Determination
Sizes are determined by the following measurements:

#### Size Ranges for Petite Length
| Size | Ankle (cm) | Calf (cm) | Thigh (cm) | Length (cm) | G Range (cm) |
|------|------------|-----------|------------|-------------|--------------|
| 1 | 17-19 | 27-32 | 42-47 | 62-71 | 48-56 |
| 2 | 19-21 | 29-36 | 44-51 | 62-71 | 52-61 |
| 3 | 21-23 | 32-39 | 48-55 | 62-71 | 56-66 |
| 4 | 23-25 | 34-42 | 52-59 | 62-71 | 60-71 |
| 5 | 25-27 | 36-45 | 55-63 | 62-71 | 64-76 |
| 6 | 27-29 | 38-48 | 59-67 | 62-71 | 68-81 |
| 7 | 29-31 | 40-50 | 63-70 | 62-71 | 71-83 |
| 8 | 30-33 | 42-52 | 67-73 | 62-71 | 74-90 |

#### Size Ranges for Normal Length
| Size | Ankle (cm) | Calf (cm) | Thigh (cm) | Length (cm) | G Range (cm) |
|------|------------|-----------|------------|-------------|--------------|
| 1 | 17-19 | 27-32 | 42-47 | 72-83 | 48-56 |
| 2 | 19-21 | 29-36 | 44-51 | 72-83 | 52-61 |
| 3 | 21-23 | 32-39 | 48-55 | 72-83 | 56-66 |
| 4 | 23-25 | 34-42 | 52-59 | 72-83 | 60-71 |
| 5 | 25-27 | 36-45 | 55-63 | 72-83 | 64-76 |
| 6 | 27-29 | 38-48 | 59-67 | 72-83 | 68-81 |
| 7 | 29-31 | 40-50 | 63-70 | 72-83 | 71-83 |
| 8 | 30-33 | 42-52 | 67-73 | 72-83 | 74-90 |

### G+ Determination
For thigh-length stockings only:
- G+ is indicated when the thigh measurement falls within the G range AND exceeds the normal C range for the determined size
- G+ is shown in the size result but does not affect the SKU code

## Confidence Score
The tool calculates a confidence score for the fit based on how well measurements align with size ranges:

- **100%**: Perfect fit - all measurements fall exactly within ranges
- **90%**: Excellent fit - measurements within 10% deviation
- **75%**: Good fit - measurements within 20% deviation
- **60%**: Moderate fit - measurements within 30% deviation
- **40%**: Fair fit - measurements within 50% deviation
- **20%**: Poor fit - measurements significantly outside ranges

### Confidence Score Recommendations
- **≥75%**: Very reliable fit
- **60-74%**: Acceptable fit - double-check measurements
- **<60%**: Verify measurements carefully and consider specialist consultation

## Technical Implementation

### Core Components
1. **SKU Generator Class**
   - Handles size determination
   - Calculates confidence scores
   - Generates SKU codes

2. **Size Lookup Tables**
   - Contains measurement ranges for each size
   - Separate tables for Petite and Normal lengths

3. **Measurement Validation**
   - Validates input measurements against acceptable ranges
   - Provides feedback for out-of-range measurements

### Key Functions

#### determineInitialSize(ankle)
Determines initial size based on ankle measurement:
```javascript
if (ankle >= 17 && ankle <= 19) return 1;
if (ankle > 19 && ankle <= 21) return 2;
// ... continues for sizes 3-8
```

#### determineLengthType(legLength)
Determines if the stocking should be Petite or Normal length:
```javascript
if (legLength >= 62 && legLength <= 71) return "Petite";
if (legLength >= 72 && legLength <= 83) return "Normal";
```

#### determineStockingCode(length, legLengthType)
Determines the style code based on length and type:
```javascript
if (length === "thigh_length") {
    return (legLengthType === "Petite") ? "59" : "69";
} else if (length === "knee_length") {
    return (legLengthType === "Petite") ? "47" : "40";
}
```

## Error Handling
The system includes comprehensive error handling for:
- Out-of-range measurements
- Invalid input values
- Missing required measurements
- Incompatible measurement combinations

## User Interface
- Clean, modern interface
- Real-time validation
- Clear measurement instructions
- Visual confidence indicators
- Tooltips for guidance
- Copy functionality for SKU codes

## Installation and Usage
1. Include required JavaScript files:
   ```html
   <script src="./js/sizeLookup.js"></script>
   <script src="./js/skuGenerator.js"></script>
   <script src="./js/main.js"></script>
   ```

2. Include Tailwind CSS for styling:
   ```html
   <script src="https://cdn.tailwindcss.com"></script>
   ```

3. Initialize the SKU Generator:
   ```javascript
   document.addEventListener('DOMContentLoaded', () => {
       new SKUInterface();
   });
   ```

## Testing Considerations
- Validate measurement combinations
- Check edge cases for size ranges
- Verify G+ determination logic
- Test confidence score calculations
- Confirm SKU generation accuracy
- Verify error handling
- Test cross-browser compatibility

## Maintenance and Updates
- Regular validation of size ranges
- Updates to confidence calculation logic
- UI/UX improvements
- Browser compatibility updates
- Performance optimizations

## Support and Documentation
For additional support or documentation:
- Check measurement guidelines
- Verify size ranges
- Consult compression stocking specifications
- Review fitting guidelines# stocking-sku-generator
