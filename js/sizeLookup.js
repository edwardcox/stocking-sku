// sizeLookup.js
const sizeLookupTable = {
    'thigh_length': {
        'Normal': [
            { A_min: 17, A_max: 19, B_min: 27, B_max: 32, C_min: 42, C_max: 47, D_min: 72, D_max: 95, G_min: 48, G_max: 56, Size: 1 },
            { A_min: 19, A_max: 21, B_min: 29, B_max: 36, C_min: 44, C_max: 51, D_min: 72, D_max: 95, G_min: 52, G_max: 61, Size: 2 },
            { A_min: 21, A_max: 23, B_min: 32, B_max: 39, C_min: 48, C_max: 55, D_min: 72, D_max: 95, G_min: 56, G_max: 66, Size: 3 },
            { A_min: 23, A_max: 25, B_min: 34, B_max: 42, C_min: 52, C_max: 59, D_min: 72, D_max: 95, G_min: 60, G_max: 71, Size: 4 },
            { A_min: 25, A_max: 27, B_min: 36, B_max: 45, C_min: 55, C_max: 63, D_min: 72, D_max: 95, G_min: 64, G_max: 76, Size: 5 },
            { A_min: 27, A_max: 29, B_min: 38, B_max: 48, C_min: 59, C_max: 67, D_min: 72, D_max: 95, G_min: 68, G_max: 81, Size: 6 },
            { A_min: 29, A_max: 31, B_min: 40, B_max: 50, C_min: 63, C_max: 70, D_min: 72, D_max: 95, G_min: 71, G_max: 83, Size: 7 },
            { A_min: 30, A_max: 33, B_min: 42, B_max: 52, C_min: 67, C_max: 73, D_min: 72, D_max: 95, G_min: 74, G_max: 90, Size: 8 }
        ],
        'Normal': [
            { A_min: 17, A_max: 19, B_min: 27, B_max: 32, C_min: 42, C_max: 47, D_min: 72, D_max: 83, G_min: 48, G_max: 56, Size: 1 },
            { A_min: 19, A_max: 21, B_min: 29, B_max: 36, C_min: 44, C_max: 51, D_min: 72, D_max: 83, G_min: 52, G_max: 61, Size: 2 },
            { A_min: 21, A_max: 23, B_min: 32, B_max: 39, C_min: 48, C_max: 55, D_min: 72, D_max: 83, G_min: 56, G_max: 66, Size: 3 },
            { A_min: 23, A_max: 25, B_min: 34, B_max: 42, C_min: 52, C_max: 59, D_min: 72, D_max: 83, G_min: 60, G_max: 71, Size: 4 },
            { A_min: 25, A_max: 27, B_min: 36, B_max: 45, C_min: 55, C_max: 63, D_min: 72, D_max: 83, G_min: 64, G_max: 76, Size: 5 },
            { A_min: 27, A_max: 29, B_min: 38, B_max: 48, C_min: 59, C_max: 67, D_min: 72, D_max: 83, G_min: 68, G_max: 81, Size: 6 },
            { A_min: 29, A_max: 31, B_min: 40, B_max: 50, C_min: 63, C_max: 70, D_min: 72, D_max: 83, G_min: 71, G_max: 83, Size: 7 },
            { A_min: 30, A_max: 33, B_min: 42, B_max: 52, C_min: 67, C_max: 73, D_min: 72, D_max: 83, G_min: 74, G_max: 90, Size: 8 }
        ]
    },
    'knee_length': {
        'Petite': [
            { A_min: 17, A_max: 19, B_min: 27, B_max: 32, D_min: 20, D_max: 38, Size: 1 },
            { A_min: 19, A_max: 21, B_min: 29, B_max: 36, D_min: 20, D_max: 38, Size: 2 },
            { A_min: 21, A_max: 23, B_min: 32, B_max: 39, D_min: 20, D_max: 38, Size: 3 },
            { A_min: 23, A_max: 25, B_min: 34, B_max: 42, D_min: 20, D_max: 38, Size: 4 },
            { A_min: 25, A_max: 27, B_min: 36, B_max: 45, D_min: 20, D_max: 38, Size: 5 },
            { A_min: 27, A_max: 29, B_min: 38, B_max: 48, D_min: 20, D_max: 38, Size: 6 },
            { A_min: 29, A_max: 31, B_min: 40, B_max: 50, D_min: 20, D_max: 38, Size: 7 },
            { A_min: 30, A_max: 33, B_min: 42, B_max: 52, D_min: 20, D_max: 38, Size: 8 }
        ],
        'Normal': [
            { A_min: 17, A_max: 19, B_min: 27, B_max: 32, D_min: 39, D_max: 50, Size: 1 },
            { A_min: 19, A_max: 21, B_min: 29, B_max: 36, D_min: 39, D_max: 50, Size: 2 },
            { A_min: 21, A_max: 23, B_min: 32, B_max: 39, D_min: 39, D_max: 50, Size: 3 },
            { A_min: 23, A_max: 25, B_min: 34, B_max: 42, D_min: 39, D_max: 50, Size: 4 },
            { A_min: 25, A_max: 27, B_min: 36, B_max: 45, D_min: 39, D_max: 50, Size: 5 },
            { A_min: 27, A_max: 29, B_min: 38, B_max: 48, D_min: 39, D_max: 50, Size: 6 },
            { A_min: 29, A_max: 31, B_min: 40, B_max: 50, D_min: 39, D_max: 50, Size: 7 },
            { A_min: 30, A_max: 33, B_min: 42, B_max: 52, D_min: 39, D_max: 50, Size: 8 }
        ]
    }
};