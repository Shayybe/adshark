// Modify the fetchTrafficData function in traffic-chart.js to use static data
function fetchTrafficData() {
    const loadingDiv = document.querySelector('.traffic-loading');
    if (loadingDiv) loadingDiv.style.display = 'block';

    try {
        // Static data
        const data = [
            {
                country: "India - IN",
                impressions: "43,708,512",
                total_impressions: "46,396,470",
                recommended_cpm: 0.58
            },
            {
                country: "Indonesia - ID",
                impressions: "25,450,616",
                total_impressions: "26,426,657",
                recommended_cpm: 1.23
            },
            {
                country: "Brazil - BR",
                impressions: "9,192,819",
                total_impressions: "10,408,194",
                recommended_cpm: 1.18
            },
            {
                country: "United States - US",
                impressions: "8,050,641",
                total_impressions: "10,501,851",
                recommended_cpm: 7.70
            },
            {
                country: "Philippines - PH",
                impressions: "7,780,977",
                total_impressions: "8,302,796",
                recommended_cpm: 1.22
            },
            {
                country: "Egypt - EG",
                impressions: "6,634,271",
                total_impressions: "7,676,072",
                recommended_cpm: 1.62
            },
            {
                country: "Bangladesh - BD",
                impressions: "5,279,047",
                total_impressions: "5,611,791",
                recommended_cpm: 2.81
            },
            {
                country: "Vietnam - VN",
                impressions: "5,236,689",
                total_impressions: "5,821,865",
                recommended_cpm: 1.19
            },
            {
                country: "Mexico - MX",
                impressions: "5,104,535",
                total_impressions: "6,143,030",
                recommended_cpm: 1.80
            },
            {
                country: "Nigeria - NG",
                impressions: "5,034,232",
                total_impressions: "5,182,018",
                recommended_cpm: 2.70
            },
            {
                country: "Thailand - TH",
                impressions: "4,868,942",
                total_impressions: "5,340,733",
                recommended_cpm: 2.75
            },
            {
                country: "France - FR",
                impressions: "4,009,587",
                total_impressions: "6,486,856",
                recommended_cpm: 3.07
            },
            {
                country: "Germany - DE",
                impressions: "3,972,970",
                total_impressions: "7,553,221",
                recommended_cpm: 3.15
            },
            {
                country: "Japan - JP",
                impressions: "3,296,654",
                total_impressions: "4,803,621",
                recommended_cpm: 2.67
            },
            {
                country: "Turkey - TR",
                impressions: "2,897,648",
                total_impressions: "3,461,695",
                recommended_cpm: 1.12
            },
            {
                country: "Saudi Arabia - SA",
                impressions: "2,566,781",
                total_impressions: "2,807,667",
                recommended_cpm: 1.63
            },
            {
                country: "Pakistan - PK",
                impressions: "2,550,930",
                total_impressions: "3,043,255",
                recommended_cpm: 1.79
            },
            {
                country: "Romania - RO",
                impressions: "2,371,210",
                total_impressions: "3,255,174",
                recommended_cpm: 2.20
            },
            {
                country: "Italy - IT",
                impressions: "2,246,784",
                total_impressions: "3,085,719",
                recommended_cpm: 2.65
            },
            {
                country: "Colombia - CO",
                impressions: "2,233,581",
                total_impressions: "2,794,476",
                recommended_cpm: 0.81
            },
            {
                country: "Algeria - DZ",
                impressions: "2,037,776",
                total_impressions: "2,280,620",
                recommended_cpm: 0.74
            },
            {
                country: "Spain - ES",
                impressions: "1,972,285",
                total_impressions: "3,346,951",
                recommended_cpm: 2.84
            },
            {
                country: "South Africa - ZA",
                impressions: "1,887,911",
                total_impressions: "2,163,574",
                recommended_cpm: 4.40
            },
            {
                country: "Malaysia - MY",
                impressions: "1,855,598",
                total_impressions: "2,198,301",
                recommended_cpm: 3.70
            },
            {
                country: "Nepal - NP",
                impressions: "1,667,012",
                total_impressions: "1,764,578",
                recommended_cpm: 3.12
            },
            {
                country: "United Kingdom - GB",
                impressions: "1,373,928",
                total_impressions: "2,159,511",
                recommended_cpm: 5.36
            },
            {
                country: "Peru - PE",
                impressions: "1,332,427",
                total_impressions: "1,852,559",
                recommended_cpm: 0.96
            },
            {
                country: "Argentina - AR",
                impressions: "1,301,299",
                total_impressions: "1,946,374",
                recommended_cpm: 1.27
            },
            {
                country: "Morocco - MA",
                impressions: "1,249,273",
                total_impressions: "1,543,233",
                recommended_cpm: 2.73
            },
            {
                country: "Kenya - KE",
                impressions: "1,176,284",
                total_impressions: "1,330,843",
                recommended_cpm: 5.96
            },
            {
                country: "Canada - CA",
                impressions: "1,150,417",
                total_impressions: "1,881,889",
                recommended_cpm: 4.73
            },
            {
                country: "Sri Lanka - LK",
                impressions: "1,099,534",
                total_impressions: "1,275,006",
                recommended_cpm: 4.91
            },
            {
                country: "Iraq - IQ",
                impressions: "981,185",
                total_impressions: "1,039,423",
                recommended_cpm: 0.84
            },
            {
                country: "Taiwan - TW",
                impressions: "950,178",
                total_impressions: "1,324,067",
                recommended_cpm: 2.54
            },
            {
                country: "China - CN",
                impressions: "926,535",
                total_impressions: "1,356,888",
                recommended_cpm: 2.89
            },
            {
                country: "Chile - CL",
                impressions: "832,672",
                total_impressions: "1,171,149",
                recommended_cpm: 2.21
            },
            {
                country: "Bulgaria - BG",
                impressions: "825,569",
                total_impressions: "1,271,114",
                recommended_cpm: 8.67
            },
            {
                country: "Greece - GR",
                impressions: "819,926",
                total_impressions: "1,515,528",
                recommended_cpm: 1.86
            },
            {
                country: "Korea, Republic of - KR",
                impressions: "796,550",
                total_impressions: "1,112,167",
                recommended_cpm: 4.35
            },
            {
                country: "Ghana - GH",
                impressions: "696,049",
                total_impressions: "760,001",
                recommended_cpm: 2.76
            },
            {
                country: "Syrian Arab Republic - SY",
                impressions: "663,923",
                total_impressions: "686,921",
                recommended_cpm: 0.12
            },
            {
                country: "Jordan - JO",
                impressions: "654,755",
                total_impressions: "775,077",
                recommended_cpm: 0.66
            },
            {
                country: "Libya - LY",
                impressions: "635,049",
                total_impressions: "656,855",
                recommended_cpm: 0.27
            },
            {
                country: "Iran, Islamic Republic of - IR",
                impressions: "629,316",
                total_impressions: "664,905",
                recommended_cpm: 0.69
            },
            {
                country: "Poland - PL",
                impressions: "602,520",
                total_impressions: "1,337,986",
                recommended_cpm: 2.39
            },
            {
                country: "Senegal - SN",
                impressions: "564,408",
                total_impressions: "624,244",
                recommended_cpm: 1.24
            },
            {
                country: "Venezuela - VE",
                impressions: "563,801",
                total_impressions: "698,060",
                recommended_cpm: 0.45
            },
            {
                country: "Ethiopia - ET",
                impressions: "563,606",
                total_impressions: "620,601",
                recommended_cpm: 0.75
            },
            {
                country: "Kuwait - KW",
                impressions: "553,133",
                total_impressions: "644,748",
                recommended_cpm: 3.92
            },
            {
                country: "Ecuador - EC",
                impressions: "520,273",
                total_impressions: "701,498",
                recommended_cpm: 0.90
            },
            {
                country: "United Arab Emirates - AE",
                impressions: "502,821",
                total_impressions: "574,635",
                recommended_cpm: 4.60
            },
            {
                country: "Bolivia - BO",
                impressions: "462,835",
                total_impressions: "594,036",
                recommended_cpm: 0.50
            },
            {
                country: "Belgium - BE",
                impressions: "438,494",
                total_impressions: "752,660",
                recommended_cpm: 3.05
            },
            {
                country: "Portugal - PT",
                impressions: "417,183",
                total_impressions: "694,893",
                recommended_cpm: 2.52
            },
            {
                country: "Australia - AU",
                impressions: "411,060",
                total_impressions: "636,142",
                recommended_cpm: 5.51
            },
            {
                country: "Tanzania, United Republic of - TZ",
                impressions: "409,863",
                total_impressions: "441,653",
                recommended_cpm: 1.60
            },
            {
                country: "Cameroon - CM",
                impressions: "405,737",
                total_impressions: "423,758",
                recommended_cpm: 3.49
            },
            {
                country: "Netherlands - NL",
                impressions: "404,906",
                total_impressions: "653,076",
                recommended_cpm: 6.06
            },
            {
                country: "Oman - OM",
                impressions: "404,006",
                total_impressions: "483,603",
                recommended_cpm: 2.43
            },
            {
                country: "Cote D'Ivoire - CI",
                impressions: "399,762",
                total_impressions: "455,995",
                recommended_cpm: 3.00
            },
            {
                country: "Tunisia - TN",
                impressions: "382,871",
                total_impressions: "487,937",
                recommended_cpm: 0.55
            },
            {
                country: "Czech Republic - CZ",
                impressions: "373,932",
                total_impressions: "701,864",
                recommended_cpm: 3.05
            },
            {
                country: "Dominican Republic - DO",
                impressions: "366,041",
                total_impressions: "486,117",
                recommended_cpm: 1.20
            },
            {
                country: "Switzerland - CH",
                impressions: "346,111",
                total_impressions: "641,364",
                recommended_cpm: 4.35
            },
            {
                country: "Guatemala - GT",
                impressions: "345,250",
                total_impressions: "392,305",
                recommended_cpm: 1.25
            },
            {
                country: "Austria - AT",
                impressions: "335,914",
                total_impressions: "671,954",
                recommended_cpm: 2.71
            },
            {
                country: "Burkina Faso - BF",
                impressions: "331,817",
                total_impressions: "341,771",
                recommended_cpm: 2.42
            },
            {
                country: "Myanmar - MM",
                impressions: "331,712",
                total_impressions: "350,636",
                recommended_cpm: 3.39
            },
            {
                country: "Israel - IL",
                impressions: "323,768",
                total_impressions: "415,727",
                recommended_cpm: 2.75
            },
            {
                country: "Singapore - SG",
                impressions: "323,099",
                total_impressions: "429,852",
                recommended_cpm: 2.89
            },
            {
                country: "Congo, The Democratic Republic of the - CD",
                impressions: "318,871",
                total_impressions: "330,325",
                recommended_cpm: 2.30
            },
            {
                country: "Uganda - UG",
                impressions: "308,350",
                total_impressions: "343,417",
                recommended_cpm: 1.66
            },
            {
                country: "Hong Kong - HK",
                impressions: "294,880",
                total_impressions: "429,391",
                recommended_cpm: 3.17
            },
            {
                country: "Yemen - YE",
                impressions: "282,086",
                total_impressions: "297,894",
                recommended_cpm: 1.01
            },
            {
                country: "Hungary - HU",
                impressions: "273,146",
                total_impressions: "550,495",
                recommended_cpm: 1.63
            },
            {
                country: "Cambodia - KH",
                impressions: "247,281",
                total_impressions: "275,583",
                recommended_cpm: 1.52
            },
            {
                country: "Sudan - SD",
                impressions: "245,461",
                total_impressions: "248,451",
                recommended_cpm: 1.55
            },
            {
                country: "Zambia - ZM",
                impressions: "233,890",
                total_impressions: "253,159",
                recommended_cpm: 4.10
            },
            {
                country: "Sweden - SE",
                impressions: "222,732",
                total_impressions: "371,496",
                recommended_cpm: 4.82
            },
            {
                country: "Slovakia - SK",
                impressions: "220,080",
                total_impressions: "448,401",
                recommended_cpm: 2.12
            },
            {
                country: "Uzbekistan - UZ",
                impressions: "216,984",
                total_impressions: "222,050",
                recommended_cpm: 2.00
            },
            {
                country: "Lebanon - LB",
                impressions: "215,560",
                total_impressions: "238,810",
                recommended_cpm: 0.34
            },
            {
                country: "Palestinian Territory - PS",
                impressions: "213,610",
                total_impressions: "249,490",
                recommended_cpm: 0.49
            },
            {
                country: "Paraguay - PY",
                impressions: "206,085",
                total_impressions: "262,024",
                recommended_cpm: 0.51
            },
            {
                country: "Mozambique - MZ",
                impressions: "200,721",
                total_impressions: "211,621",
                recommended_cpm: 5.73
            },
            {
                country: "Panama - PA",
                impressions: "191,703",
                total_impressions: "242,336",
                recommended_cpm: 1.07
            },
            {
                country: "Mali - ML",
                impressions: "191,331",
                total_impressions: "196,851",
                recommended_cpm: 3.05
            },
            {
                country: "Serbia - RS",
                impressions: "187,116",
                total_impressions: "274,429",
                recommended_cpm: 0.84
            },
            {
                country: "Honduras - HN",
                impressions: "183,063",
                total_impressions: "210,669",
                recommended_cpm: 1.84
            },
            {
                country: "Angola - AO",
                impressions: "177,393",
                total_impressions: "206,470",
                recommended_cpm: 3.76
            },
            {
                country: "Qatar - QA",
                impressions: "163,220",
                total_impressions: "183,317",
                recommended_cpm: 2.00
            },
            {
                country: "El Salvador - SV",
                impressions: "160,189",
                total_impressions: "197,617",
                recommended_cpm: 0.52
            },
            {
                country: "Cuba - CU",
                impressions: "157,216",
                total_impressions: "170,424",
                recommended_cpm: 0.44
            },
            {
                country: "New Zealand - NZ",
                impressions: "154,947",
                total_impressions: "246,778",
                recommended_cpm: 5.41
            },
            {
                country: "Costa Rica - CR",
                impressions: "154,274",
                total_impressions: "189,394",
                recommended_cpm: 1.07
            },
            {
                country: "Puerto Rico - PR",
                impressions: "153,893",
                total_impressions: "179,030",
                recommended_cpm: 2.58
            },
            {
                country: "Croatia - HR",
                impressions: "138,146",
                total_impressions: "245,540",
                recommended_cpm: 1.46
            },
            {
                country: "Azerbaijan - AZ",
                impressions: "137,223",
                total_impressions: "147,952",
                recommended_cpm: 2.82
            },
            {
                country: "Ireland - IE",
                impressions: "135,207",
                total_impressions: "211,467",
                recommended_cpm: 2.88
            },
            {
                country: "Uruguay - UY",
                impressions: "133,091",
                total_impressions: "209,041",
                recommended_cpm: 0.98
            },
            {
                country: "Afghanistan - AF",
                impressions: "122,344",
                total_impressions: "126,432",
                recommended_cpm: 1.15
            },
            {
                country: "Lao People's Democratic Republic - LA",
                impressions: "118,031",
                total_impressions: "124,153",
                recommended_cpm: 1.18
            },
            {
                country: "Kazakhstan - KZ",
                impressions: "115,753",
                total_impressions: "129,978",
                recommended_cpm: 1.55
            },
            {
                country: "Nicaragua - NI",
                impressions: "113,883",
                total_impressions: "124,734",
                recommended_cpm: 0.86
            },
            {
                country: "Trinidad and Tobago - TT",
                impressions: "104,077",
                total_impressions: "140,812",
                recommended_cpm: 0.67
            },
            {
                country: "Benin - BJ",
                impressions: "102,289",
                total_impressions: "114,058",
                recommended_cpm: 2.59
            },
            {
                country: "Guinea - GN",
                impressions: "100,829",
                total_impressions: "103,444",
                recommended_cpm: 3.29
            },
            {
                country: "Malawi - MW",
                impressions: "98,023",
                total_impressions: "107,627",
                recommended_cpm: 9.74
            },
            {
                country: "Denmark - DK",
                impressions: "92,600",
                total_impressions: "162,747",
                recommended_cpm: 3.07
            },
            {
                country: "Norway - NO",
                impressions: "88,342",
                total_impressions: "150,933",
                recommended_cpm: 5.35
            },
            {
                country: "Togo - TG",
                impressions: "84,470",
                total_impressions: "108,932",
                recommended_cpm: 0.99
            },
            {
                country: "Mongolia - MN",
                impressions: "82,581",
                total_impressions: "96,459",
                recommended_cpm: 1.34
            },
            {
                country: "Cyprus - CY",
                impressions: "80,512",
                total_impressions: "120,188",
                recommended_cpm: 1.68
            },
            {
                country: "Mauritania - MR",
                impressions: "79,136",
                total_impressions: "83,161",
                recommended_cpm: 1.61
            },
            {
                country: "Georgia - GE",
                impressions: "78,780",
                total_impressions: "103,831",
                recommended_cpm: 1.30
            },
            {
                country: "Papua New Guinea - PG",
                impressions: "75,816",
                total_impressions: "79,550",
                recommended_cpm: 1.33
            },
            {
                country: "Albania - AL",
                impressions: "73,698",
                total_impressions: "96,230",
                recommended_cpm: 0.50
            },
            {
                country: "Finland - FI",
                impressions: "72,901",
                total_impressions: "119,692",
                recommended_cpm: 2.67
            },
            {
                country: "Bosnia and Herzegovina - BA",
                impressions: "71,072",
                total_impressions: "103,389",
                recommended_cpm: 0.54
            },
            {
                country: "Kosovo - XK",
                impressions: "68,576",
                total_impressions: "107,351",
                recommended_cpm: 0.37
            },
            {
                country: "Madagascar - MG",
                impressions: "67,822",
                total_impressions: "106,920",
                recommended_cpm: 1.06
            },
            {
                country: "Mauritius - MU",
                impressions: "66,002",
                total_impressions: "87,372",
                recommended_cpm: 0.62
            },
            {
                country: "Macedonia - MK",
                impressions: "65,642",
                total_impressions: "90,944",
                recommended_cpm: 1.09
            },
            {
                country: "Haiti - HT",
                impressions: "64,944",
                total_impressions: "74,699",
                recommended_cpm: 1.00
            },
            {
                country: "Gabon - GA",
                impressions: "64,618",
                total_impressions: "87,174",
                recommended_cpm: 0.98
            },
            {
                country: "Moldova, Republic of - MD",
                impressions: "63,666",
                total_impressions: "82,074",
                recommended_cpm: 0.38
            },
            {
                country: "Bahrain - BH",
                impressions: "62,724",
                total_impressions: "71,824",
                recommended_cpm: 1.76
            },
            {
                country: "Rwanda - RW",
                impressions: "60,472",
                total_impressions: "85,413",
                recommended_cpm: 2.65
            },
            {
                country: "Somalia - SO",
                impressions: "59,573",
                total_impressions: "64,073",
                recommended_cpm: 2.83
            },
            {
                country: "Lithuania - LT",
                impressions: "51,878",
                total_impressions: "89,041",
                recommended_cpm: 2.28
            },
            {
                country: "Zimbabwe - ZW",
                impressions: "51,779",
                total_impressions: "69,471",
                recommended_cpm: 2.05
            },
            {
                country: "Congo - CG",
                impressions: "50,946",
                total_impressions: "60,847",
                recommended_cpm: 2.91
            },
            {
                country: "Reunion - RE",
                impressions: "50,794",
                total_impressions: "93,973",
                recommended_cpm: 0.60
            },
            {
                country: "Guyana - GY",
                impressions: "45,230",
                total_impressions: "53,183",
                recommended_cpm: 0.66
            },
            {
                country: "Jamaica - JM",
                impressions: "41,660",
                total_impressions: "64,069",
                recommended_cpm: 0.88
            },
            {
                country: "Namibia - NA",
                impressions: "40,057",
                total_impressions: "53,053",
                recommended_cpm: 1.17
            },
            {
                country: "Slovenia - SI",
                impressions: "39,911",
                total_impressions: "71,556",
                recommended_cpm: 1.16
            },
            {
                country: "Niger - NE",
                impressions: "39,082",
                total_impressions: "40,080",
                recommended_cpm: 0.43
            },
            {
                country: "Maldives - MV",
                impressions: "38,718",
                total_impressions: "44,005",
                recommended_cpm: 0.91
            },
            {
                country: "Brunei Darussalam - BN",
                impressions: "35,331",
                total_impressions: "43,909",
                recommended_cpm: 0.76
            },
            {
                country: "Botswana - BW",
                impressions: "33,678",
                total_impressions: "43,612",
                recommended_cpm: 2.13
            },
            {
                country: "Latvia - LV",
                impressions: "32,594",
                total_impressions: "54,287",
                recommended_cpm: 6.62
            },
            {
                country: "Fiji - FJ",
                impressions: "30,941",
                total_impressions: "38,312",
                recommended_cpm: 0.60
            },
            {
                country: "Armenia - AM",
                impressions: "30,824",
                total_impressions: "37,777",
                recommended_cpm: 1.64
            },
            {
                country: "Kyrgyzstan - KG",
                impressions: "29,978",
                total_impressions: "33,675",
                recommended_cpm: 1.32
            },
            {
                country: "Sierra Leone - SL",
                impressions: "29,866",
                total_impressions: "31,509",
                recommended_cpm: 4.43
            },
            {
                country: "Suriname - SR",
                impressions: "29,712",
                total_impressions: "33,658",
                recommended_cpm: 0.57
            },
            {
                country: "Belize - BZ",
                impressions: "28,092",
                total_impressions: "34,345",
                recommended_cpm: 0.46
            },
            {
                country: "Macau - MO",
                impressions: "27,188",
                total_impressions: "40,867",
                recommended_cpm: 2.60
            },
            {
                country: "Guadeloupe - GP",
                impressions: "27,069",
                total_impressions: "44,920",
                recommended_cpm: 0.60
            },
            {
                country: "Gambia - GM",
                impressions: "25,722",
                total_impressions: "28,735",
                recommended_cpm: 2.52
            },
            {
                country: "Luxembourg - LU",
                impressions: "25,644",
                total_impressions: "49,365",
                recommended_cpm: 0.79
            },
            {
                country: "Martinique - MQ",
                impressions: "23,174",
                total_impressions: "41,015",
                recommended_cpm: 0.51
            },
            {
                country: "Montenegro - ME",
                impressions: "22,377",
                total_impressions: "31,954",
                recommended_cpm: 0.52
            },
            {
                country: "Chad - TD",
                impressions: "22,359",
                total_impressions: "22,911",
                recommended_cpm: 0.95
            },
            {
                country: "Bahamas - BS",
                impressions: "21,238",
                total_impressions: "27,596",
                recommended_cpm: 0.93
            },
            {
                country: "Swaziland - SZ",
                impressions: "19,833",
                total_impressions: "21,995",
                recommended_cpm: 0.72
            },
            {
                country: "Timor-Leste - TL",
                impressions: "19,367",
                total_impressions: "19,902",
                recommended_cpm: 0.64
            },
            {
                country: "French Polynesia - PF",
                impressions: "18,912",
                total_impressions: "29,474",
                recommended_cpm: 0.53
            },
            {
                country: "Burundi - BI",
                impressions: "17,788",
                total_impressions: "19,159",
                recommended_cpm: 1.70
            },
            {
                country: "Liberia - LR",
                impressions: "17,723",
                total_impressions: "18,591",
                recommended_cpm: 2.85
            },
            {
                country: "Barbados - BB",
                impressions: "16,531",
                total_impressions: "24,863",
                recommended_cpm: 0.62
            },
            {
                country: "Malta - MT",
                impressions: "16,146",
                total_impressions: "27,925",
                recommended_cpm: 1.16
            },
            {
                country: "Bhutan - BT",
                impressions: "16,060",
                total_impressions: "18,239",
                recommended_cpm: 0.44
            },
            {
                country: "South Sudan - SS",
                impressions: "15,881",
                total_impressions: "16,790",
                recommended_cpm: 0.73
            },
            {
                country: "French Guiana - GF",
                impressions: "15,789",
                total_impressions: "23,049",
                recommended_cpm: 0.59
            },
            {
                country: "Lesotho - LS",
                impressions: "14,838",
                total_impressions: "17,800",
                recommended_cpm: 1.15
            },
            {
                country: "Estonia - EE",
                impressions: "14,695",
                total_impressions: "30,921",
                recommended_cpm: 3.32
            },
            {
                country: "Cape Verde - CV",
                impressions: "13,909",
                total_impressions: "17,323",
                recommended_cpm: 0.69
            },
            {
                country: "Curacao - CW",
                impressions: "13,790",
                total_impressions: "16,411",
                recommended_cpm: 0.86
            },
            {
                country: "Djibouti - DJ",
                impressions: "12,401",
                total_impressions: "14,733",
                recommended_cpm: 0.76
            },
            {
                country: "Guinea-Bissau - GW",
                impressions: "12,338",
                total_impressions: "12,910",
                recommended_cpm: 1.85
            },
            {
                country: "Tajikistan - TJ",
                impressions: "11,912",
                total_impressions: "12,492",
                recommended_cpm: 1.45
            },
            {
                country: "New Caledonia - NC",
                impressions: "11,577",
                total_impressions: "19,488",
                recommended_cpm: 0.66
            },
            {
                country: "Saint Lucia - LC",
                impressions: "10,387",
                total_impressions: "12,613",
                recommended_cpm: 0.54
            },
            {
                country: "Solomon Islands - SB",
                impressions: "9,702",
                total_impressions: "10,366",
                recommended_cpm: 0.67
            },
            {
                country: "Guam - GU",
                impressions: "9,057",
                total_impressions: "11,453",
                recommended_cpm: 0.72
            },
            {
                country: "Iceland - IS",
                impressions: "8,735",
                total_impressions: "17,720",
                recommended_cpm: 1.17
            },
            {
                country: "Central African Republic - CF",
                impressions: "8,280",
                total_impressions: "8,433",
                recommended_cpm: 1.99
            },
            {
                country: "Aruba - AW",
                impressions: "8,085",
                total_impressions: "10,023",
                recommended_cpm: 0.74
            },
            {
                country: "Comoros - KM",
                impressions: "8,067",
                total_impressions: "8,780",
                recommended_cpm: 0.78
            },
            {
                country: "Dominica - DM",
                impressions: "7,745",
                total_impressions: "9,998",
                recommended_cpm: 0.41
            },
            {
                country: "Seychelles - SC",
                impressions: "7,034",
                total_impressions: "8,392",
                recommended_cpm: 0.73
            },
            {
                country: "Equatorial Guinea - GQ",
                impressions: "6,846",
                total_impressions: "8,211",
                recommended_cpm: 0.59
            },
            {
                country: "Turkmenistan - TM",
                impressions: "6,655",
                total_impressions: "6,847",
                recommended_cpm: 0.15
            },
            {
                country: "Vanuatu - VU",
                impressions: "6,501",
                total_impressions: "7,110",
                recommended_cpm: 0.44
            },
            {
                country: "Antigua and Barbuda - AG",
                impressions: "6,488",
                total_impressions: "7,411",
                recommended_cpm: 1.02
            },
            {
                country: "Grenada - GD",
                impressions: "6,084",
                total_impressions: "7,748",
                recommended_cpm: 1.10
            },
            {
                country: "Mayotte - YT",
                impressions: "6,037",
                total_impressions: "7,380",
                recommended_cpm: 0.57
            },
            {
                country: "Cayman Islands - KY",
                impressions: "5,272",
                total_impressions: "7,543",
                recommended_cpm: 0.87
            },
            {
                country: "Saint Vincent and the Grenadines - VC",
                impressions: "5,216",
                total_impressions: "6,549",
                recommended_cpm: 0.69
            },
            {
                country: "Samoa - WS",
                impressions: "4,724",
                total_impressions: "5,448",
                recommended_cpm: 0.64
            },
            {
                country: "Saint Kitts and Nevis - KN",
                impressions: "4,567",
                total_impressions: "6,130",
                recommended_cpm: 0.88
            },
            {
                country: "Virgin Islands, U.S. - VI",
                impressions: "4,102",
                total_impressions: "5,025",
                recommended_cpm: 1.54
            },
            {
                country: "Andorra - AD",
                impressions: "3,947",
                total_impressions: "7,940",
                recommended_cpm: 0.27
            },
            {
                country: "Virgin Islands, British - VG",
                impressions: "3,439",
                total_impressions: "4,391",
                recommended_cpm: 1.20
            },
            {
                country: "Sao Tome and Principe - ST",
                impressions: "3,171",
                total_impressions: "3,658",
                recommended_cpm: 0.46
            },
            {
                country: "Sint Maarten (Dutch part) - SX",
                impressions: "2,815",
                total_impressions: "3,793",
                recommended_cpm: 1.00
            },
            {
                country: "Turks and Caicos Islands - TC",
                impressions: "2,795",
                total_impressions: "3,748",
                recommended_cpm: 1.02
            },
            {
                country: "Jersey - JE",
                impressions: "2,743",
                total_impressions: "4,462",
                recommended_cpm: 3.15
            },
            {
                country: "American Samoa - AS",
                impressions: "2,358",
                total_impressions: "3,519",
                recommended_cpm: 0.83
            },
            {
                country: "Bonaire, Saint Eustatius and Saba - BQ",
                impressions: "2,226",
                total_impressions: "2,733",
                recommended_cpm: 0.67
            },
            {
                country: "Bermuda - BM",
                impressions: "2,170",
                total_impressions: "3,606",
                recommended_cpm: 3.15
            },
            {
                country: "Tonga - TO",
                impressions: "2,096",
                total_impressions: "2,569",
                recommended_cpm: 0.72
            },
            {
                country: "Greenland - GL",
                impressions: "1,773",
                total_impressions: "2,608",
                recommended_cpm: 1.08
            },
            {
                country: "Northern Mariana Islands - MP",
                impressions: "1,772",
                total_impressions: "2,670",
                recommended_cpm: 0.36
            },
            {
                country: "Isle of Man - IM",
                impressions: "1,708",
                total_impressions: "2,811",
                recommended_cpm: 2.91
            },
            {
                country: "Micronesia, Federated States of - FM",
                impressions: "1,632",
                total_impressions: "2,139",
                recommended_cpm: 0.43
            },
            {
                country: "Palau - PW",
                impressions: "1,323",
                total_impressions: "1,539",
                recommended_cpm: 0.40
            },
            {
                country: "Anguilla - AI",
                impressions: "1,268",
                total_impressions: "1,678",
                recommended_cpm: 0.80
            },
            {
                country: "Guernsey - GG",
                impressions: "1,260",
                total_impressions: "2,168",
                recommended_cpm: 3.25
            },
            {
                country: "Gibraltar - GI",
                impressions: "1,083",
                total_impressions: "1,985",
                recommended_cpm: 0.64
            },
            {
                country: "Liechtenstein - LI",
                impressions: "1,027",
                total_impressions: "2,532",
                recommended_cpm: 0.41
            },
            {
                country: "Faroe Islands - FO",
                impressions: "910",
                total_impressions: "1,481",
                recommended_cpm: 0.78
            },
            {
                country: "Saint Martin - MF",
                impressions: "835",
                total_impressions: "1,266",
                recommended_cpm: 0.66
            },
            {
                country: "Marshall Islands - MH",
                impressions: "818",
                total_impressions: "1,112",
                recommended_cpm: 0.36
            },
            {
                country: "Monaco - MC",
                impressions: "814",
                total_impressions: "1,613",
                recommended_cpm: 0.52
            },
            {
                country: "Cook Islands - CK",
                impressions: "667",
                total_impressions: "816",
                recommended_cpm: 0.37
            },
            {
                country: "San Marino - SM",
                impressions: "593",
                total_impressions: "1,099",
                recommended_cpm: 0.40
            },
            {
                country: "Kiribati - KI",
                impressions: "390",
                total_impressions: "402",
                recommended_cpm: 0.37
            },
            {
                country: "Montserrat - MS",
                impressions: "371",
                total_impressions: "541",
                recommended_cpm: 0.45
            },
            {
                country: "Nauru - NR",
                impressions: "311",
                total_impressions: "319",
                recommended_cpm: 0.42
            },
            {
                country: "British Indian Ocean Territory - IO",
                impressions: "299",
                total_impressions: "342",
                recommended_cpm: 0.26
            },
            {
                country: "Aland Islands - AX",
                impressions: "286",
                total_impressions: "647",
                recommended_cpm: 0.62
            },
            {
                country: "Wallis and Futuna - WF",
                impressions: "181",
                total_impressions: "222",
                recommended_cpm: 0.23
            },
            {
                country: "Saint Pierre and Miquelon - PM",
                impressions: "173",
                total_impressions: "581",
                recommended_cpm: 0.33
            },
            {
                country: "Saint Barthelemy - BL",
                impressions: "107",
                total_impressions: "177",
                recommended_cpm: 1.54
            },
            {
                country: "Falkland Islands (Malvinas) - FK",
                impressions: "68",
                total_impressions: "81",
                recommended_cpm: 0.50
            },
            {
                country: "Eritrea - ER",
                impressions: "40",
                total_impressions: "83",
                recommended_cpm: 0.39
            },
            {
                country: "Saint Helena - SH",
                impressions: "12",
                total_impressions: "21",
                recommended_cpm: 0.42
            },
            {
                country: "Norfolk Island - NF",
                impressions: "7",
                total_impressions: "9",
                recommended_cpm: 0.54
            },
            {
                country: "Tokelau - TK",
                impressions: "5",
                total_impressions: "5",
                recommended_cpm: 0.35
            },
            {
                country: "Tuvalu - TV",
                impressions: "4",
                total_impressions: "7",
                recommended_cpm: 0.37
            },
            {
                country: "Holy See (Vatican City State) - VA",
                impressions: "4",
                total_impressions: "16",
                recommended_cpm: 0.13
            },
            {
                country: "Korea, Democratic People's Republic of - KP",
                impressions: "3",
                total_impressions: "10",
                recommended_cpm: 0.21
            },
            {
                country: "Cocos (Keeling) Islands - CC",
                impressions: "3",
                total_impressions: "3",
                recommended_cpm: 0.15
            },
            {
                country: "Pitcairn Islands - PN",
                impressions: "0",
                total_impressions: "18",
                recommended_cpm: 0.15
            },
            {
                country: "Niue - NU",
                impressions: "0",
                total_impressions: "0",
                recommended_cpm: 0.18
            }
        ];

        updateTrafficTable(data);
    } catch (error) {
        Toast.show('Error loading traffic data', 'error');
    } finally {
        if (loadingDiv) loadingDiv.style.display = 'none';
    }
}

function updateTrafficTable(data) {
    const tableBody = document.querySelector('.traffic-table tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="Country">${item.country}</td>
            <td data-label="Impressions">${item.impressions} / ${item.total_impressions}</td>
            <td data-label="Recommended CPM">$${item.recommended_cpm.toFixed(2)}</td>
            <td data-label="Action">
                <button class="create-campaign-btn" onclick="trafficModule.createCampaign('${item.country}', ${item.recommended_cpm})">
                    Create campaign
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Update event handlers if needed
document.addEventListener('DOMContentLoaded', () => {
    const filterSelects = document.querySelectorAll('.traffic-filters select, .second-row select');
    filterSelects.forEach(select => {
        select.addEventListener('change', () => {
            fetchTrafficData(); // This will refresh the table with the same static data
        });
    });
});

// Export for use in dashboard.js
window.trafficModule = {
    fetchTrafficData,
    updateTrafficTable,
    createCampaign: (country, recommendedCPM) => {
        sessionStorage.setItem('selectedCountry', country);
        sessionStorage.setItem('recommendedCPM', recommendedCPM);
        showTab('newCampaign');
    }
};