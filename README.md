# Stocking SKU Generator

## Software Stack
- PHP 8.2
- JavaScript (Vanilla)
- Tailwind CSS (via CDN)
- HTML5

## Overview
The Stocking SKU Generator is a web-based tool designed to generate unique SKU (Stock Keeping Unit) codes for medical compression stockings based on specific measurements and product options. This tool ensures accurate sizing and product specification for medical compression stockings.

## Purpose
This tool helps healthcare providers and medical supply professionals to:
- Determine the correct stocking size based on patient measurements
- Generate accurate SKU codes for ordering
- Validate measurements against established size ranges
- Ensure proper product specification
- Provide measurement guidance and fit confidence scores

## Project Structure
```
/project-root
    /dist
        output.css
    /fonts
        PIRULEN.ttf
    /images
        scintera-logo.webp
    /js
        sizeLookup.js
        skuGenerator.js
        main.js
    index.php
    README.md
```

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
For Thigh Length:
- **Petite**: Leg length 62-71 cm
- **Normal**: Leg length 72-95 cm

For Knee Length:
- **Petite**: Leg length 20-38 cm
- **Normal**: Leg length 39-50 cm

### Size Determination
Sizes are determined by the following measurements:

#### Size Ranges for Thigh Length
| Size | Ankle (cm) | Calf (cm) | Thigh (cm) | Length (cm) | G Range (cm) |
|------|------------|-----------|------------|-------------|--------------|
| 1 | 17-19 | 27-32 | 42-47 | 72-95 | 48-56 |
| 2 | 19-21 | 29-36 | 44-51 | 72-95 | 52-61 |
| 3 | 21-23 | 32-39 | 48-55 | 72-95 | 56-66 |
| 4 | 23-25 | 34-42 | 52-59 | 72-95 | 60-71 |
| 5 | 25-27 | 36-45 | 55-63 | 72-95 | 64-76 |
| 6 | 27-29 | 38-48 | 59-67 | 72-95 | 68-81 |
| 7 | 29-31 | 40-50 | 63-70 | 72-95 | 71-83 |
| 8 | 30-33 | 42-52 | 67-73 | 72-95 | 74-90 |

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
1. **SKU Generator Class (skuGenerator.js)**
   - Handles size determination
   - Calculates confidence scores
   - Generates SKU codes

2. **Size Lookup Tables (sizeLookup.js)**
   - Contains measurement ranges for each size
   - Separate tables for Petite and Normal lengths

3. **Interface Handler (main.js)**
   - Manages user interactions
   - Handles form validation
   - Updates UI elements
   - Manages tooltips and guidance

4. **Styling**
   - Uses Tailwind CSS for responsive design
   - Custom PIRULEN font for branding
   - Custom tooltips for measurement guidance

### Installation

1. Server Requirements:
   - PHP 8.2 or higher
   - Web server (Apache/Nginx)

2. Setup:
   ```bash
   # Clone repository
   git clone [repository-url]

   # Create required directories
   mkdir -p fonts images js

   # Place required files
   # - Put PIRULEN.ttf in /fonts
   # - Put logo in /images
   # - Place JavaScript files in /js
   ```

3. Configuration:
   - Ensure proper file permissions
   - Configure web server to serve PHP files
   - Verify paths in index.php match your setup

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Maintenance
Regular updates required for:
- Measurement ranges
- Size determination logic
- Browser compatibility
- Security patches
- PHP version compatibility

## Testing Considerations
- Validate all measurement combinations
- Test edge cases for size ranges
- Verify G+ determination logic
- Test confidence score calculations
- Confirm SKU generation accuracy
- Verify error handling
- Cross-browser compatibility testing

## Support
For technical support or feature requests:
- Open an issue in the repository
- Contact development team
- Refer to documentation