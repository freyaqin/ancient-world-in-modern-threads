import { assetPath } from './asset-path.js';
// Marker positions are percentages of each uncropped installation mockup.
// Marker numbers follow the approved grid order, including Fluting.
export const installations = {
  "Cascade": {
    "name": "Cascade",
    "image": "/cases/cascade.webp",
    "source": "Mocked Cases/Seated Muse.png",
    "alt": "Proposed Cascade installation: eight garments beneath framed artworks, with a seated sculpture to the left.",
    "width": 1516,
    "height": 1072,
    "minWidth": 640,
    "markers": [
      {
        "id": "3136",
        "x": 24.5,
        "y": 59
      },
      {
        "id": "2012.08.026abcde",
        "x": 33,
        "y": 59
      },
      {
        "id": "1999.27.006a-d",
        "x": 42.4,
        "y": 59
      },
      {
        "id": "2012.08.019ab",
        "x": 51,
        "y": 59
      },
      {
        "id": "1999.27.004ab",
        "x": 68.3,
        "y": 59
      },
      {
        "id": "915",
        "x": 76.1,
        "y": 59
      },
      {
        "id": "2026.06.177ab",
        "x": 84.6,
        "y": 59
      },
      {
        "id": "2026.06.302",
        "x": 93,
        "y": 59
      }
    ]
  },
  "Contrapposto": {
    "name": "Contrapposto",
    "image": "/cases/contrapposto.webp",
    "source": "Mocked Cases/Aphrodite Fréjus.png",
    "alt": "Proposed Contrapposto installation: three black-and-white garments seen from behind, with an Aphrodite sculpture in the foreground.",
    "width": 964,
    "height": 1284,
    "minWidth": 300,
    "maxWidth": 650,
    "markers": [
      {
        "id": "2002.05.084 + 2002.05.083",
        "x": 30,
        "y": 52
      },
      {
        "id": "2026.06.249ab",
        "x": 50,
        "y": 36
      },
      {
        "id": "2002.05.090",
        "x": 68,
        "y": 52
      }
    ]
  },
  "Fluting": {
    "name": "Fluting",
    "image": "/cases/fluting.webp",
    "source": "Mocked Cases/Fluting After.png",
    "alt": "Proposed Fluting installation: a sculptural cast at the left, a dark blue gown, green Fortuny gown, aqua ensemble, striped garment, and ivory beaded dress, with a book and screen between them.",
    "width": 1698,
    "height": 1276,
    "minWidth": 460,
    "note": "Numbers match the object grid. The mockup places the borrowed Madame Grès garment at the left; the saved object order is unchanged.",
    "markers": [
      {
        "id": "2021.12.001",
        "x": 36,
        "y": 62
      },
      {
        "id": "2012.08.027ab",
        "x": 62,
        "y": 62
      },
      {
        "id": "loan-issey-miyake",
        "x": 74,
        "y": 62
      },
      {
        "id": "2026.06.301",
        "x": 85,
        "y": 62
      },
      {
        "id": "loan-madame-gres",
        "x": 23.5,
        "y": 62
      }
    ]
  },
  "Mantled": {
    "name": "Mantled",
    "image": "/cases/mantled.webp",
    "source": "Mocked Cases/Small Figurines.png",
    "alt": "Proposed Mantled installation: five gowns in pink, cream, yellow, brown, and taupe beneath two shelves of small draped figurines.",
    "width": 1840,
    "height": 1388,
    "minWidth": 380,
    "markers": [
      {
        "id": "2002.08.005",
        "x": 14,
        "y": 60
      },
      {
        "id": "2002.08.015",
        "x": 31,
        "y": 60
      },
      {
        "id": "2002.08.016",
        "x": 46,
        "y": 60
      },
      {
        "id": "2002.08.006",
        "x": 63,
        "y": 60
      },
      {
        "id": "2026.06.143",
        "x": 80,
        "y": 60
      }
    ]
  },
  "Meander": {
    "name": "Meander",
    "image": "/cases/meander.webp",
    "source": "Mocked Cases/meander.png",
    "alt": "Proposed Meander installation: five garments below a shelf of pottery. From left: hooded wrap, black-and-orange printed dress, beige satin dress, beaded chiffon dress, and ivory wedding gown.",
    "width": 1518,
    "height": 1136,
    "minWidth": 360,
    "markers": [
      {
        "id": "322",
        "x": 21,
        "y": 63
      },
      {
        "id": "2002.09.066",
        "x": 36.5,
        "y": 61
      },
      {
        "id": "1995.07.009",
        "x": 49.5,
        "y": 61
      },
      {
        "id": "2015.08.001",
        "x": 63.5,
        "y": 61
      },
      {
        "id": "2024.08.007abc",
        "x": 77.5,
        "y": 61
      }
    ]
  },
  "Gilded": {
    "name": "Gilded",
    "image": "/cases/gilded.webp",
    "source": "Mocked Cases/gilded.png",
    "alt": "Proposed Gilded installation: five dark garments with metallic and beaded ornament beneath framed objects, a necklace, and a blue textile.",
    "width": 1520,
    "height": 1140,
    "minWidth": 380,
    "markers": [
      {
        "id": "2015.30.016",
        "x": 22.5,
        "y": 62
      },
      {
        "id": "883",
        "x": 37,
        "y": 62
      },
      {
        "id": "1999.17.001",
        "x": 52.5,
        "y": 62
      },
      {
        "id": "2017.47.003",
        "x": 68,
        "y": 62
      },
      {
        "id": "1997.17.017ab",
        "x": 83,
        "y": 62
      }
    ]
  }
};

for (const installation of Object.values(installations)) installation.image = assetPath(installation.image);
