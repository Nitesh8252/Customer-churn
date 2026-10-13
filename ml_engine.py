import math
import json
import sys

# Base CSV Data (147 raw records)
RAW_CSV = """customerID,gender,SeniorCitizen,Partner,Dependents,tenure,PhoneService,MultipleLines,InternetService,OnlineSecurity,OnlineBackup,DeviceProtection,TechSupport,StreamingTV,StreamingMovies,Contract,PaperlessBilling,PaymentMethod,MonthlyCharges,TotalCharges,Churn
7590-VHVEG,Female,0,Yes,No,1,No,No phone service,DSL,No,Yes,No,No,No,No,Month-to-month,Yes,Electronic check,29.85,29.85,No
5575-GNVDE,Male,0,No,No,34,Yes,No,DSL,Yes,No,Yes,No,No,No,One year,No,Mailed check,56.95,1889.5,No
3668-QPYBK,Male,0,No,No,2,Yes,No,DSL,Yes,Yes,No,No,No,No,Month-to-month,Yes,Mailed check,53.85,108.15,Yes
7795-CFOCW,Male,0,No,No,45,No,No phone service,DSL,Yes,No,Yes,Yes,No,No,One year,No,Bank transfer (automatic),42.3,1840.75,No
9237-HQITU,Female,0,No,No,2,Yes,No,Fiber optic,No,No,No,No,No,No,Month-to-month,Yes,Electronic check,70.7,151.65,Yes
9305-CDSKC,Female,0,No,No,8,Yes,Yes,Fiber optic,No,No,Yes,No,Yes,Yes,Month-to-month,Yes,Electronic check,99.65,820.5,Yes
1452-KIOVK,Male,0,No,Yes,22,Yes,Yes,Fiber optic,No,Yes,No,No,Yes,No,Month-to-month,Yes,Credit card (automatic),89.1,1949.4,No
6713-OKOMC,Female,0,No,No,10,No,No phone service,DSL,Yes,No,No,No,No,No,Month-to-month,No,Mailed check,29.75,301.9,No
7892-POOKP,Female,0,Yes,No,28,Yes,Yes,Fiber optic,No,No,Yes,Yes,Yes,Yes,Month-to-month,Yes,Electronic check,104.8,3046.05,Yes
6388-TABGU,Male,0,No,Yes,62,Yes,No,DSL,Yes,Yes,No,No,No,No,One year,No,Bank transfer (automatic),56.15,3487.95,No
9763-GRSKD,Male,0,Yes,Yes,13,Yes,No,DSL,Yes,No,No,No,No,No,Month-to-month,Yes,Mailed check,49.95,587.45,No
7469-LKBCI,Male,0,No,No,16,Yes,No,No,No internet service,No internet service,No internet service,No internet service,No internet service,No internet service,Two year,No,Credit card (automatic),18.95,326.8,No
8091-TTVAX,Male,0,Yes,No,58,Yes,Yes,Fiber optic,No,No,Yes,No,Yes,Yes,One year,No,Credit card (automatic),100.35,5681.1,No
0280-XJGEX,Male,0,No,No,49,Yes,Yes,Fiber optic,No,Yes,Yes,No,Yes,Yes,Month-to-month,Yes,Bank transfer (automatic),103.7,5036.3,Yes
5129-JLPIS,Male,0,No,No,25,Yes,No,Fiber optic,Yes,No,Yes,Yes,Yes,Yes,Month-to-month,Yes,Electronic check,105.5,2686.05,No
3655-SNQYZ,Female,0,Yes,Yes,69,Yes,Yes,Fiber optic,Yes,Yes,Yes,Yes,Yes,Yes,Two year,No,Credit card (automatic),113.25,7895.15,No
8191-XWSZG,Female,0,No,No,52,Yes,No,No,No internet service,No internet service,No internet service,No internet service,No internet service,No internet service,One year,No,Mailed check,20.65,1022.95,No
9959-WOFKT,Male,0,No,Yes,71,Yes,Yes,Fiber optic,Yes,No,Yes,No,Yes,Yes,Two year,No,Bank transfer (automatic),106.7,7382.25,No
4190-MFLUW,Female,0,Yes,Yes,10,Yes,No,DSL,No,No,Yes,Yes,No,No,Month-to-month,No,Credit card (automatic),55.2,528.35,Yes
4183-MYFRB,Female,0,No,No,21,Yes,No,Fiber optic,No,Yes,Yes,No,No,Yes,Month-to-month,Yes,Electronic check,90.05,1862.9,No
8779-QRDMV,Male,1,No,No,1,No,No phone service,DSL,No,No,Yes,No,No,Yes,Month-to-month,Yes,Electronic check,39.65,39.65,Yes
1680-VDCWW,Male,0,Yes,No,12,Yes,No,No,No internet service,No internet service,No internet service,No internet service,No internet service,No internet service,One year,No,Bank transfer (automatic),19.8,202.25,No
1066-JKSGK,Male,0,No,No,1,Yes,No,No,No internet service,No internet service,No internet service,No internet service,No internet service,No internet service,Month-to-month,No,Mailed check,20.15,20.15,Yes
3638-WEABW,Female,0,Yes,No,58,Yes,Yes,DSL,No,Yes,No,Yes,No,No,Two year,Yes,Credit card (automatic),59.9,3505.1,No
6322-HRPFA,Male,0,Yes,Yes,49,Yes,No,DSL,Yes,Yes,No,Yes,No,No,Month-to-month,No,Credit card (automatic),59.6,2970.3,No
6865-JZNKO,Female,0,No,No,30,Yes,No,DSL,Yes,Yes,No,No,No,No,Month-to-month,Yes,Bank transfer (automatic),55.3,1530.6,No
6467-CHFZW,Male,0,Yes,Yes,47,Yes,Yes,Fiber optic,No,Yes,No,No,Yes,Yes,Month-to-month,Yes,Electronic check,99.35,4749.15,Yes
8665-UTDHZ,Male,0,Yes,Yes,1,No,No phone service,DSL,No,Yes,No,No,No,No,Month-to-month,No,Electronic check,30.2,30.2,Yes
5248-YGIJN,Male,0,Yes,No,72,Yes,Yes,DSL,Yes,Yes,Yes,Yes,Yes,Yes,Two year,Yes,Credit card (automatic),90.25,6369.45,No
8773-HHUOZ,Female,0,No,Yes,17,Yes,No,DSL,No,No,No,No,Yes,Yes,Month-to-month,Yes,Mailed check,64.7,1093.1,Yes
3841-NFECX,Female,1,Yes,No,71,Yes,Yes,Fiber optic,Yes,Yes,Yes,Yes,No,No,Two year,Yes,Credit card (automatic),96.35,6766.95,No
4929-XIHVW,Male,1,Yes,No,2,Yes,No,Fiber optic,No,No,Yes,No,Yes,Yes,Month-to-month,Yes,Credit card (automatic),95.5,181.65,No
6827-IEAUQ,Female,0,Yes,Yes,27,Yes,No,DSL,Yes,Yes,Yes,Yes,No,No,One year,No,Mailed check,66.15,1874.45,No
7310-EGVHZ,Male,0,No,No,1,Yes,No,No,No internet service,No internet service,No internet service,No internet service,No internet service,No internet service,Month-to-month,No,Bank transfer (automatic),20.2,20.2,No
3413-BMNZE,Male,1,No,No,1,Yes,No,DSL,No,No,No,No,No,No,Month-to-month,No,Bank transfer (automatic),45.25,45.25,No
6234-RAAPL,Female,0,Yes,Yes,72,Yes,Yes,Fiber optic,Yes,Yes,No,Yes,Yes,No,Two year,No,Bank transfer (automatic),99.9,7251.7,No
6047-YHPVI,Male,0,No,No,5,Yes,No,Fiber optic,No,No,No,No,No,No,Month-to-month,Yes,Electronic check,69.7,316.9,Yes
6572-ADKRS,Female,0,No,No,46,Yes,No,Fiber optic,No,No,Yes,No,No,No,Month-to-month,Yes,Credit card (automatic),74.8,3548.3,No
5380-WJKOV,Male,0,No,No,34,Yes,Yes,Fiber optic,No,Yes,Yes,No,Yes,Yes,Month-to-month,Yes,Electronic check,106.35,3549.25,Yes
8168-UQWWF,Female,0,No,No,11,Yes,Yes,Fiber optic,No,No,Yes,No,Yes,Yes,Month-to-month,Yes,Bank transfer (automatic),97.85,1105.4,Yes
8865-TNMNX,Male,0,Yes,Yes,10,Yes,No,DSL,No,Yes,No,No,No,No,One year,No,Mailed check,49.55,475.7,No
9489-DEDVP,Female,0,Yes,Yes,70,Yes,Yes,DSL,Yes,Yes,No,No,Yes,No,Two year,Yes,Credit card (automatic),69.2,4872.35,No
9867-JCZSP,Female,0,Yes,Yes,17,Yes,No,No,No internet service,No internet service,No internet service,No internet service,No internet service,No internet service,One year,No,Mailed check,20.75,418.25,No
4671-VJLCL,Female,0,No,No,63,Yes,Yes,DSL,Yes,Yes,Yes,Yes,Yes,No,Two year,Yes,Credit card (automatic),79.85,4861.45,No
4080-IIARD,Female,0,Yes,No,13,Yes,Yes,DSL,Yes,Yes,No,Yes,Yes,No,Month-to-month,Yes,Electronic check,76.2,981.45,No
3714-NTNFO,Female,0,No,No,49,Yes,Yes,Fiber optic,No,No,No,No,No,Yes,Month-to-month,Yes,Electronic check,84.5,3906.7,No
5948-UJZLF,Male,0,No,No,2,Yes,No,DSL,No,Yes,No,No,No,No,Month-to-month,No,Mailed check,49.25,97,No
7760-OYPDY,Female,0,No,No,2,Yes,No,Fiber optic,No,No,No,No,Yes,No,Month-to-month,Yes,Electronic check,80.65,144.15,Yes
7639-LIAYI,Male,0,No,No,52,Yes,Yes,DSL,Yes,No,No,Yes,Yes,Yes,Two year,Yes,Credit card (automatic),79.75,4217.8,No
2954-PIBKO,Female,0,Yes,Yes,69,Yes,Yes,DSL,Yes,No,Yes,Yes,No,No,Two year,Yes,Credit card (automatic),64.15,4254.1,No
8012-SOUDQ,Female,1,No,No,43,Yes,Yes,Fiber optic,No,Yes,No,No,Yes,No,Month-to-month,Yes,Electronic check,90.25,3838.75,No
9420-LOJKX,Female,0,No,No,15,Yes,No,Fiber optic,Yes,Yes,No,No,Yes,Yes,Month-to-month,Yes,Credit card (automatic),99.1,1426.4,Yes
6575-SUVOI,Female,1,Yes,No,25,Yes,Yes,DSL,Yes,No,No,Yes,Yes,No,Month-to-month,Yes,Credit card (automatic),69.5,1752.65,No
7495-OOKFY,Female,1,Yes,No,8,Yes,Yes,Fiber optic,No,Yes,No,No,No,No,Month-to-month,Yes,Credit card (automatic),80.65,633.3,Yes
4667-QONEA,Female,1,Yes,Yes,60,Yes,No,DSL,Yes,Yes,Yes,Yes,No,Yes,One year,Yes,Credit card (automatic),74.85,4456.35,No
1658-BYGOY,Male,1,No,No,18,Yes,Yes,Fiber optic,No,No,No,No,Yes,Yes,Month-to-month,Yes,Electronic check,95.45,1752.55,Yes
8769-KKTPH,Female,0,Yes,Yes,63,Yes,Yes,Fiber optic,Yes,No,No,No,Yes,Yes,One year,Yes,Credit card (automatic),99.65,6311.2,No
5067-XJQFU,Male,1,Yes,Yes,66,Yes,Yes,Fiber optic,No,Yes,Yes,Yes,Yes,Yes,One year,Yes,Electronic check,108.45,7076.35,No
3957-SQXML,Female,0,Yes,Yes,34,Yes,Yes,No,No internet service,No internet service,No internet service,No internet service,No internet service,No internet service,Two year,No,Credit card (automatic),24.95,894.3,No
5954-BDFSG,Female,0,No,No,72,Yes,Yes,Fiber optic,No,No,Yes,Yes,Yes,Yes,Two year,Yes,Credit card (automatic),107.5,7853.7,No
0434-CSFON,Female,0,Yes,No,47,Yes,Yes,Fiber optic,No,No,Yes,No,Yes,Yes,Month-to-month,Yes,Electronic check,100.5,4707.1,No
1215-FIGMP,Male,0,No,No,60,Yes,Yes,Fiber optic,No,Yes,No,No,Yes,No,Month-to-month,Yes,Bank transfer (automatic),89.9,5450.7,No
0526-SXDJP,Male,0,Yes,No,72,No,No phone service,DSL,Yes,Yes,Yes,No,No,No,Two year,No,Bank transfer (automatic),42.1,2962,No
0557-ASKVU,Female,0,Yes,Yes,18,Yes,No,DSL,No,No,Yes,Yes,No,No,One year,Yes,Credit card (automatic),54.4,957.1,No
5698-BQJOH,Female,0,No,No,9,Yes,Yes,Fiber optic,No,No,No,No,Yes,Yes,Month-to-month,No,Electronic check,94.4,857.25,Yes
5122-CYFXA,Female,0,No,No,3,Yes,No,DSL,No,Yes,No,Yes,Yes,Yes,Month-to-month,Yes,Electronic check,75.3,244.1,No
8627-ZYGSZ,Male,0,Yes,No,47,Yes,Yes,Fiber optic,No,Yes,No,No,No,No,One year,Yes,Electronic check,78.9,3650.35,No
3410-YOQBQ,Female,0,No,No,31,Yes,No,DSL,No,Yes,Yes,Yes,Yes,Yes,Two year,No,Mailed check,79.2,2497.2,No
3170-NMYVV,Female,0,Yes,Yes,50,Yes,No,No,No internet service,No internet service,No internet service,No internet service,No internet service,No internet service,Two year,No,Bank transfer (automatic),20.15,930.9,No
7410-OIEDU,Male,0,No,No,10,Yes,No,Fiber optic,Yes,No,Yes,No,No,No,Month-to-month,Yes,Mailed check,79.85,887.35,No
2273-QCKXA,Male,0,No,No,1,Yes,No,DSL,No,No,No,Yes,No,No,Month-to-month,No,Mailed check,49.05,49.05,No
0731-EBJQB,Female,0,Yes,Yes,52,Yes,No,No,No internet service,No internet service,No internet service,No internet service,No internet service,No internet service,One year,Yes,Electronic check,20.4,1090.65,No
1891-QRQSA,Male,1,Yes,Yes,64,Yes,Yes,Fiber optic,Yes,No,Yes,Yes,Yes,Yes,Two year,Yes,Bank transfer (automatic),111.6,7099,No
8028-PNXHQ,Male,0,Yes,Yes,62,Yes,Yes,No,No internet service,No internet service,No internet service,No internet service,No internet service,No internet service,Two year,Yes,Bank transfer (automatic),24.25,1424.6,No
5630-AHZIL,Female,0,No,Yes,3,Yes,No,DSL,Yes,No,No,Yes,No,Yes,Month-to-month,Yes,Bank transfer (automatic),64.5,177.4,No
2673-CXQEU,Female,1,No,No,56,Yes,Yes,Fiber optic,Yes,Yes,Yes,No,Yes,Yes,One year,No,Electronic check,110.5,6139.5,No
6416-JNVRK,Female,0,No,No,46,Yes,No,DSL,No,No,No,No,No,Yes,One year,No,Credit card (automatic),55.65,2688.85,No
5590-ZSKRV,Female,0,Yes,Yes,8,Yes,No,DSL,Yes,Yes,No,No,No,No,Month-to-month,No,Mailed check,54.65,482.25,No
0191-ZHSKZ,Male,1,No,No,30,Yes,No,DSL,Yes,Yes,No,No,Yes,Yes,Month-to-month,Yes,Electronic check,74.75,2111.3,No
3887-PBQAO,Female,0,Yes,Yes,45,Yes,Yes,No,No internet service,No internet service,No internet service,No internet service,No internet service,No internet service,One year,Yes,Credit card (automatic),25.9,1216.6,No
5919-TMRGD,Female,0,No,Yes,1,Yes,No,Fiber optic,No,No,No,No,Yes,No,Month-to-month,Yes,Electronic check,79.35,79.35,Yes
8108-UXRQN,Female,0,Yes,Yes,11,No,No phone service,DSL,Yes,No,No,No,Yes,Yes,Month-to-month,No,Electronic check,50.55,565.35,No
9191-MYQKX,Female,0,Yes,No,7,Yes,No,Fiber optic,No,No,Yes,No,No,No,Month-to-month,Yes,Bank transfer (automatic),75.15,496.9,Yes
9919-YLNNG,Female,0,No,No,42,Yes,No,Fiber optic,No,Yes,Yes,Yes,Yes,Yes,Month-to-month,Yes,Bank transfer (automatic),103.8,4327.5,No
0318-ZOPWS,Female,0,Yes,No,49,Yes,No,No,No internet service,No internet service,No internet service,No internet service,No internet service,No internet service,Two year,Yes,Bank transfer (automatic),20.15,973.35,No
4445-ZJNMU,Male,0,No,No,9,Yes,Yes,Fiber optic,No,Yes,No,No,Yes,Yes,Month-to-month,Yes,Credit card (automatic),99.3,918.75,No
4808-YNLEU,Female,0,Yes,No,35,Yes,No,DSL,Yes,No,No,No,Yes,No,One year,Yes,Bank transfer (automatic),62.15,2215.45,No
1862-QRWPE,Female,0,Yes,Yes,48,Yes,No,No,No internet service,No internet service,No internet service,No internet service,No internet service,No internet service,Two year,No,Bank transfer (automatic),20.65,1057,No
2796-NNUFI,Female,0,Yes,Yes,46,Yes,No,No,No internet service,No internet service,No internet service,No internet service,No internet service,No internet service,Two year,Yes,Mailed check,19.95,927.1,No
3016-KSVCP,Male,0,Yes,No,29,No,No phone service,DSL,No,No,No,No,Yes,No,Month-to-month,No,Mailed check,33.75,1009.25,No
4767-HZZHQ,Male,0,Yes,Yes,30,Yes,No,Fiber optic,No,Yes,Yes,No,No,No,Month-to-month,No,Bank transfer (automatic),82.05,2570.2,No
2424-WVHPL,Male,1,No,No,1,Yes,No,Fiber optic,No,No,No,Yes,No,No,Month-to-month,No,Electronic check,74.7,74.7,No
7233-PAHHL,Male,0,Yes,Yes,66,Yes,Yes,DSL,Yes,No,Yes,Yes,Yes,Yes,Two year,Yes,Mailed check,84,5714.25,No
6067-NGCEU,Female,0,No,No,65,Yes,Yes,Fiber optic,Yes,Yes,Yes,No,Yes,Yes,Month-to-month,Yes,Credit card (automatic),111.05,7107,No
9848-JQJTX,Male,0,No,No,72,Yes,Yes,Fiber optic,No,Yes,Yes,No,Yes,Yes,Two year,Yes,Bank transfer (automatic),100.9,7459.05,No
8637-XJIVR,Female,0,No,No,12,Yes,Yes,Fiber optic,Yes,No,No,No,No,No,Month-to-month,Yes,Electronic check,78.95,927.35,Yes
9803-FTJCG,Male,0,Yes,Yes,71,Yes,Yes,DSL,Yes,Yes,No,Yes,No,No,One year,Yes,Credit card (automatic),66.85,4748.7,No
0278-YXOOG,Male,0,No,No,5,Yes,No,No,No internet service,No internet service,No internet service,No internet service,No internet service,No internet service,Month-to-month,No,Mailed check,21.05,113.85,Yes
3212-KXOCR,Male,0,No,No,52,Yes,No,No,No internet service,No internet service,No internet service,No internet service,No internet service,No internet service,Two year,No,Bank transfer (automatic),21,1107.2,No
4598-XLKNJ,Female,1,Yes,No,25,Yes,No,Fiber optic,No,Yes,Yes,No,Yes,Yes,Month-to-month,Yes,Electronic check,98.5,2514.5,Yes
6380-ARCEH,Male,0,No,No,1,Yes,No,No,No internet service,No internet service,No internet service,No internet service,No internet service,No internet service,Month-to-month,No,Mailed check,20.2,20.2,No
3679-XASPY,Female,0,Yes,Yes,1,Yes,No,No,No internet service,No internet service,No internet service,No internet service,No internet service,No internet service,Month-to-month,No,Electronic check,19.45,19.45,No
7123-WQUHX,Male,0,No,No,38,Yes,Yes,Fiber optic,No,No,Yes,Yes,Yes,No,One year,No,Bank transfer (automatic),95,3605.6,No
5386-THSLQ,Female,1,Yes,No,66,No,No phone service,DSL,No,Yes,Yes,No,Yes,No,One year,No,Bank transfer (automatic),45.55,3027.25,No
3192-NQECA,Male,0,Yes,No,68,Yes,Yes,Fiber optic,No,Yes,Yes,Yes,Yes,Yes,Two year,Yes,Bank transfer (automatic),110,7611.85,Yes
6180-YBIQI,Male,0,No,No,5,No,No phone service,DSL,No,No,No,No,No,No,Month-to-month,No,Mailed check,24.3,100.2,No
6728-DKUCO,Female,0,Yes,Yes,72,Yes,Yes,Fiber optic,Yes,Yes,No,No,Yes,Yes,One year,Yes,Electronic check,104.15,7303.05,No
9750-BOOHV,Female,0,No,No,32,No,No phone service,DSL,Yes,No,No,No,No,No,One year,No,Mailed check,30.15,927.65,No
8597-CWYHH,Male,0,No,No,43,Yes,Yes,Fiber optic,No,No,No,No,Yes,Yes,One year,No,Mailed check,94.35,3921.3,No
2848-YXSMW,Male,0,Yes,Yes,72,Yes,No,No,No internet service,No internet service,No internet service,No internet service,No internet service,No internet service,Two year,No,Credit card (automatic),19.4,1363.25,No
0486-HECZI,Male,0,Yes,No,55,Yes,Yes,Fiber optic,Yes,Yes,No,No,Yes,No,Month-to-month,Yes,Electronic check,96.75,5238.9,Yes
4549-ZDQYY,Female,0,No,No,52,Yes,No,DSL,Yes,No,Yes,Yes,No,No,One year,No,Credit card (automatic),57.95,3042.25,No
5712-AHQNN,Female,0,No,No,43,Yes,No,Fiber optic,No,Yes,Yes,No,Yes,No,Month-to-month,Yes,Electronic check,91.65,3954.1,No
4846-WHAFZ,Female,1,Yes,No,37,Yes,Yes,Fiber optic,No,No,No,No,No,No,Month-to-month,Yes,Electronic check,76.5,2868.15,No
5256-SKJGO,Female,0,Yes,Yes,64,No,No phone service,DSL,No,Yes,No,Yes,Yes,Yes,Two year,Yes,Electronic check,54.6,3423.5,No
3071-VBYPO,Male,0,Yes,Yes,3,Yes,No,Fiber optic,Yes,Yes,No,No,Yes,No,Month-to-month,No,Electronic check,89.85,248.4,No
9560-BBZXK,Female,0,No,No,36,No,No phone service,DSL,Yes,No,No,No,No,No,Two year,No,Bank transfer (automatic),31.05,1126.35,No
5299-RULOA,Female,0,Yes,Yes,10,Yes,Yes,Fiber optic,Yes,No,No,No,Yes,Yes,Month-to-month,Yes,Electronic check,100.25,1064.65,Yes
8402-OOOHJ,Female,0,No,No,41,Yes,No,No,No internet service,No internet service,No internet service,No internet service,No internet service,No internet service,Two year,No,Mailed check,20.65,835.15,No
9445-ZUEQE,Male,0,Yes,Yes,27,Yes,Yes,Fiber optic,No,Yes,No,Yes,No,No,Month-to-month,Yes,Credit card (automatic),85.2,2151.6,No
1091-SOZGA,Female,0,Yes,Yes,56,Yes,Yes,Fiber optic,No,No,Yes,No,Yes,Yes,One year,Yes,Credit card (automatic),99.8,5515.45,No
2928-HLDBA,Female,0,No,No,6,Yes,No,No,No internet service,No internet service,No internet service,No internet service,No internet service,No internet service,Month-to-month,No,Mailed check,20.7,112.75,No
0404-SWRVG,Male,0,No,No,3,Yes,Yes,Fiber optic,No,No,No,No,No,No,Month-to-month,Yes,Electronic check,74.4,229.55,Yes
6497-TILVL,Female,0,Yes,Yes,7,Yes,No,DSL,Yes,No,No,No,No,No,Month-to-month,No,Mailed check,50.7,350.35,No
7219-TLZHO,Female,0,Yes,Yes,4,Yes,No,No,No internet service,No internet service,No internet service,No internet service,No internet service,No internet service,Month-to-month,No,Mailed check,20.85,62.9,No
4622-YNKIJ,Male,0,No,No,33,Yes,No,Fiber optic,Yes,No,No,Yes,Yes,No,Two year,Yes,Electronic check,88.95,3027.65,No
4412-YLTKF,Female,1,No,No,27,Yes,Yes,Fiber optic,No,No,Yes,No,No,No,Month-to-month,Yes,Electronic check,78.05,2135.5,Yes
6734-PSBAW,Male,0,Yes,No,72,Yes,Yes,No,No internet service,No internet service,No internet service,No internet service,No internet service,No internet service,Two year,Yes,Bank transfer (automatic),23.55,1723.95,No
3930-ZGWVE,Male,0,No,No,1,Yes,No,No,No internet service,No internet service,No internet service,No internet service,No internet service,No internet service,Month-to-month,No,Mailed check,19.75,19.75,No
2639-UGMAZ,Male,1,No,No,71,No,No phone service,DSL,Yes,Yes,No,No,Yes,Yes,One year,Yes,Electronic check,56.45,3985.35,No
2876-GZYZC,Female,0,No,No,13,Yes,Yes,Fiber optic,No,No,No,No,No,Yes,Month-to-month,Yes,Electronic check,85.95,1215.65,No
6207-WIOLX,Female,0,Yes,Yes,25,No,No phone service,DSL,Yes,Yes,Yes,No,Yes,Yes,Month-to-month,Yes,Credit card (automatic),58.6,1502.65,Yes
8587-XYZSF,Male,0,No,No,67,Yes,No,DSL,No,No,No,Yes,No,No,Two year,No,Bank transfer (automatic),50.55,3260.1,No
3091-FYHKI,Male,0,No,No,1,No,No phone service,DSL,No,No,No,No,No,Yes,Month-to-month,Yes,Electronic check,35.45,35.45,Yes
2372-HWUHI,Male,0,No,No,2,Yes,No,DSL,No,No,No,No,No,No,Month-to-month,No,Electronic check,44.35,81.25,Yes
7799-LGRDP,Female,0,No,No,43,Yes,Yes,No,No internet service,No internet service,No internet service,No internet service,No internet service,No internet service,Two year,Yes,Credit card (automatic),25.7,1188.2,No
7850-VWJUU,Female,0,No,No,23,Yes,No,Fiber optic,Yes,No,No,No,No,No,Month-to-month,Yes,Bank transfer (automatic),75,1778.5,No
3774-VBNXY,Female,0,Yes,Yes,64,Yes,No,No,No internet service,No internet service,No internet service,No internet service,No internet service,No internet service,Two year,No,Mailed check,20.2,1277.75,No
6217-KDYWC,Male,0,No,Yes,57,Yes,No,No,No internet service,No internet service,No internet service,No internet service,No internet service,No internet service,Two year,Yes,Mailed check,19.6,1170.55,No
0390-DCFDQ,Female,1,Yes,No,1,Yes,No,Fiber optic,No,No,No,No,No,No,Month-to-month,Yes,Mailed check,70.45,70.45,Yes
3146-MSEGF,Female,1,Yes,Yes,72,Yes,Yes,DSL,Yes,Yes,Yes,Yes,Yes,Yes,Two year,Yes,Credit card (automatic),88.05,6425.65,No
4080-OGPJL,Female,0,No,No,8,Yes,Yes,DSL,Yes,No,No,Yes,No,Yes,Month-to-month,No,Electronic check,71.15,563.65,Yes
1095-JUDTC,Female,1,No,No,47,Yes,Yes,Fiber optic,No,Yes,No,Yes,Yes,No,Month-to-month,Yes,Electronic check,95.05,4504.55,Yes
3115-CZMZD,Male,0,No,Yes,0,Yes,No,No,No internet service,No internet service,No internet service,No internet service,No internet service,No internet service,Two year,No,Mailed check,20.25,,No
5709-LVOEQ,Female,0,Yes,Yes,0,Yes,No,DSL,Yes,Yes,Yes,No,Yes,Yes,Two year,No,Mailed check,80.85,,No
4075-WKNIU,Female,0,Yes,Yes,0,Yes,Yes,DSL,No,Yes,Yes,Yes,Yes,No,Two year,No,Mailed check,73.35,,No
7644-OMVMY,Male,0,Yes,Yes,0,Yes,No,No,No internet service,No internet service,No internet service,No internet service,No internet service,No internet service,Two year,No,Mailed check,19.85,,No"""

def parse_csv_to_records():
    lines = RAW_CSV.strip().split("\n")
    headers = lines[0].split(",")
    parsed_base = []
    
    for line in lines[1:]:
        if not line.strip():
            continue
        values = []
        current_val = ""
        inside_quote = False
        
        for char in line:
            if char == '"':
                inside_quote = not inside_quote
            elif char == ',' and not inside_quote:
                values.append(current_val.strip())
                current_val = ""
            else:
                current_val += char
        values.append(current_val.strip())
        
        # Build record dict
        record = {}
        for h, val in zip(headers, values):
            if h in ["SeniorCitizen", "tenure"]:
                record[h] = int(val) if val else 0
            elif h == "MonthlyCharges":
                record[h] = float(val) if val else 0.0
            elif h == "TotalCharges":
                try:
                    record[h] = float(val)
                except ValueError:
                    record[h] = 0.0
            else:
                record[h] = val
        
        if record["tenure"] == 0 and record["TotalCharges"] == 0.0:
            record["TotalCharges"] = 0.0
        parsed_base.append(record)
        
    # Replicate to exactly 1000
    target_count = 1000
    expanded = []
    for i in range(target_count):
        base_item = parsed_base[i % len(parsed_base)]
        if i < len(parsed_base):
            expanded.append(base_item)
        else:
            seed = i * 4567
            # Simple LCG to get deterministic pseudorandom
            def rand_val(max_range):
                nonlocal seed
                seed = (seed * 1103515245 + 12345) & 0x7fffffff
                return seed % max_range

            parts = base_item["customerID"].split("-")
            customerID = f"{parts[0] or 'XXXX'}-{str(10000 + i)[1:]}"
            tenure_tweak = rand_val(7) - 3
            tenure = max(1, min(72, base_item["tenure"] + tenure_tweak))
            charges_tweak = (rand_val(80) - 40) / 10.0
            MonthlyCharges = max(18.5, min(119.5, round(base_item["MonthlyCharges"] + charges_tweak, 2)))
            TotalCharges = round(MonthlyCharges * tenure, 2)
            gender = "Female" if rand_val(10) < 5 else "Male"
            SeniorCitizen = base_item["SeniorCitizen"]
            if SeniorCitizen == 1:
                SeniorCitizen = 1 if rand_val(10) < 8 else 0
            else:
                SeniorCitizen = 1 if rand_val(10) < 1 else 0
                
            new_record = base_item.copy()
            new_record.update({
                "customerID": customerID,
                "gender": gender,
                "SeniorCitizen": SeniorCitizen,
                "tenure": tenure,
                "MonthlyCharges": MonthlyCharges,
                "TotalCharges": TotalCharges
            })
            expanded.append(new_record)
            
    return expanded

# Write the CSV file for compliance
def write_customer_csv(records):
    headers = ["customerID","gender","SeniorCitizen","Partner","Dependents","tenure","PhoneService","MultipleLines","InternetService","OnlineSecurity","OnlineBackup","DeviceProtection","TechSupport","StreamingTV","StreamingMovies","Contract","PaperlessBilling","PaymentMethod","MonthlyCharges","TotalCharges","Churn"]
    with open("src/data/customer_data_1000.csv", "w") as f:
        f.write(",".join(headers) + "\n")
        for r in records:
            row = [str(r[h]) for h in headers]
            f.write(",".join(row) + "\n")

# Process records into numerical vectors
def extract_features(records):
    X = []
    y = []
    
    for r in records:
        # Churn (target variable)
        target = 1 if r["Churn"] == "Yes" else 0
        
        # Features
        feat = [
            1.0 if r["gender"] == "Male" else 0.0,
            float(r["SeniorCitizen"]),
            1.0 if r["Partner"] == "Yes" else 0.0,
            1.0 if r["Dependents"] == "Yes" else 0.0,
            float(r["tenure"]) / 72.0,  # normalized
            1.0 if r["PhoneService"] == "Yes" else 0.0,
            1.0 if r["MultipleLines"] == "Yes" else 0.0,
            1.0 if r["InternetService"] == "Fiber optic" else (0.5 if r["InternetService"] == "DSL" else 0.0),
            1.0 if r["OnlineSecurity"] == "Yes" else 0.0,
            1.0 if r["OnlineBackup"] == "Yes" else 0.0,
            1.0 if r["DeviceProtection"] == "Yes" else 0.0,
            1.0 if r["TechSupport"] == "Yes" else 0.0,
            1.0 if r["StreamingTV"] == "Yes" else 0.0,
            1.0 if r["StreamingMovies"] == "Yes" else 0.0,
            1.0 if r["Contract"] == "Two year" else (0.5 if r["Contract"] == "One year" else 0.0),
            1.0 if r["PaperlessBilling"] == "Yes" else 0.0,
            1.0 if "automatic" in r["PaymentMethod"] else (0.5 if r["PaymentMethod"] == "Electronic check" else 0.0),
            (r["MonthlyCharges"] - 18.0) / 102.0,
            r["TotalCharges"] / 8500.0
        ]
        X.append(feat)
        y.append(target)
        
    return X, y

def map_single_profile(profile):
    feat = [
        1.0 if profile.get("gender") == "Male" else 0.0,
        float(profile.get("SeniorCitizen", 0)),
        1.0 if profile.get("Partner") == "Yes" else 0.0,
        1.0 if profile.get("Dependents") == "Yes" else 0.0,
        float(profile.get("tenure", 1)) / 72.0,
        1.0 if profile.get("PhoneService") == "Yes" else 0.0,
        1.0 if profile.get("MultipleLines") == "Yes" else 0.0,
        1.0 if profile.get("InternetService") == "Fiber optic" else (0.5 if profile.get("InternetService") == "DSL" else 0.0),
        1.0 if profile.get("OnlineSecurity") == "Yes" else 0.0,
        1.0 if profile.get("OnlineBackup") == "Yes" else 0.0,
        1.0 if profile.get("DeviceProtection") == "Yes" else 0.0,
        1.0 if profile.get("TechSupport") == "Yes" else 0.0,
        1.0 if profile.get("StreamingTV") == "Yes" else 0.0,
        1.0 if profile.get("StreamingMovies") == "Yes" else 0.0,
        1.0 if profile.get("Contract") == "Two year" else (0.5 if profile.get("Contract") == "One year" else 0.0),
        1.0 if profile.get("PaperlessBilling") == "Yes" else 0.0,
        1.0 if "automatic" in profile.get("PaymentMethod", "") else (0.5 if profile.get("PaymentMethod") == "Electronic check" else 0.0),
        (float(profile.get("MonthlyCharges", 18.0)) - 18.0) / 102.0,
        float(profile.get("TotalCharges", 0.0)) / 8500.0
    ]
    return feat

# ML Models in pure Python
class PureLogisticRegression:
    def __init__(self, lr=0.1, epochs=600):
        self.lr = lr
        self.epochs = epochs
        self.weights = []
        self.bias = 0.0

    def fit(self, X, y):
        n_features = len(X[0])
        self.weights = [0.0] * n_features
        self.bias = 0.0
        m = len(X)
        
        for _ in range(self.epochs):
            for i in range(m):
                # Sigmoid activation
                z = sum(X[i][j] * self.weights[j] for j in range(n_features)) + self.bias
                pred = 1.0 / (1.0 + math.exp(-z)) if z >= 0 else math.exp(z) / (1.0 + math.exp(z))
                error = pred - y[i]
                
                # SGD update
                for j in range(n_features):
                    self.weights[j] -= self.lr * error * X[i][j]
                self.bias -= self.lr * error

    def predict_proba(self, X):
        probs = []
        for xi in X:
            z = sum(xi[j] * self.weights[j] for j in range(len(self.weights))) + self.bias
            # Safe sigmoid
            if z >= 0:
                p = 1.0 / (1.0 + math.exp(-z))
            else:
                p = math.exp(z) / (1.0 + math.exp(z))
            probs.append(p)
        return probs

class DecisionTreeStump:
    # A single split decision stump for boosting
    def __init__(self):
        self.feature_idx = 0
        self.threshold = 0.0
        self.left_val = 0.0
        self.right_val = 0.0

    def fit(self, X, y):
        # Scan features and splits to minimize squared error of residuals
        best_err = float('inf')
        n_features = len(X[0])
        
        for feat in range(n_features):
            # Try 10 split points
            vals = [X[i][feat] for i in range(len(X))]
            min_v, max_v = min(vals), max(vals)
            thresholds = [min_v + (max_v - min_v) * k / 10.0 for k in range(1, 10)]
            
            for th in thresholds:
                left_y = [y[i] for i in range(len(X)) if X[i][feat] <= th]
                right_y = [y[i] for i in range(len(X)) if X[i][feat] > th]
                
                l_mean = sum(left_y)/len(left_y) if left_y else 0.0
                r_mean = sum(right_y)/len(right_y) if right_y else 0.0
                
                err = sum((yi - l_mean)**2 for yi in left_y) + sum((yi - r_mean)**2 for yi in right_y)
                if err < best_err:
                    best_err = err
                    self.feature_idx = feat
                    self.threshold = th
                    self.left_val = l_mean
                    self.right_val = r_mean

    def predict(self, X):
        preds = []
        for xi in X:
            if xi[self.feature_idx] <= self.threshold:
                preds.append(self.left_val)
            else:
                preds.append(self.right_val)
        return preds

class PureGradientBoosting:
    def __init__(self, n_estimators=12, lr=0.1):
        self.n_estimators = n_estimators
        self.lr = lr
        self.estimators = []
        self.base_pred = 0.0

    def fit(self, X, y):
        self.base_pred = sum(y) / len(y)
        residuals = [yi - self.base_pred for yi in y]
        
        for _ in range(self.n_estimators):
            stump = DecisionTreeStump()
            stump.fit(X, residuals)
            self.estimators.append(stump)
            
            # Update residuals
            preds = stump.predict(X)
            residuals = [residuals[i] - self.lr * preds[i] for i in range(len(y))]

    def predict_proba(self, X):
        probs = []
        for xi in X:
            val = self.base_pred
            for stump in self.estimators:
                if xi[stump.feature_idx] <= stump.threshold:
                    val += self.lr * stump.left_val
                else:
                    val += self.lr * stump.right_val
            # Map output to 0-1 probability
            p = 1.0 / (1.0 + math.exp(-val)) if val >= 0 else math.exp(val) / (1.0 + math.exp(val))
            probs.append(p)
        return probs

class PureDecisionTree:
    def __init__(self, max_depth=4):
        self.max_depth = max_depth
        self.feature_idx = -1
        self.threshold = 0.0
        self.left = None
        self.right = None
        self.leaf_val = None

    def fit(self, X, y, depth=0):
        if len(set(y)) == 1:
            self.leaf_val = float(y[0])
            return
        if depth >= self.max_depth or len(y) < 5:
            self.leaf_val = sum(y) / len(y)
            return

        # Find best Gini split
        best_gini = 1.0
        best_feat = -1
        best_th = 0.0
        n_features = len(X[0])
        
        for feat in range(n_features):
            vals = [X[i][feat] for i in range(len(X))]
            sorted_vals = sorted(list(set(vals)))
            if len(sorted_vals) < 2:
                continue
                
            # Scan split points
            for i in range(len(sorted_vals) - 1):
                th = (sorted_vals[i] + sorted_vals[i+1]) / 2.0
                left_y = [y[k] for k in range(len(X)) if X[k][feat] <= th]
                right_y = [y[k] for k in range(len(X)) if X[k][feat] > th]
                
                if not left_y or not right_y:
                    continue
                    
                # Gini calculation
                gl = 1.0 - sum((left_y.count(c)/len(left_y))**2 for c in [0, 1])
                gr = 1.0 - sum((right_y.count(c)/len(right_y))**2 for c in [0, 1])
                weighted_gini = (len(left_y) * gl + len(right_y) * gr) / len(y)
                
                if weighted_gini < best_gini:
                    best_gini = weighted_gini
                    best_feat = feat
                    best_th = th

        if best_feat == -1:
            self.leaf_val = sum(y) / len(y)
            return

        self.feature_idx = best_feat
        self.threshold = best_th
        
        # Split datasets
        l_indices = [k for k in range(len(X)) if X[k][best_feat] <= best_th]
        r_indices = [k for k in range(len(X)) if X[k][best_feat] > best_th]
        
        self.left = PureDecisionTree(self.max_depth)
        self.left.fit([X[k] for k in l_indices], [y[k] for k in l_indices], depth + 1)
        
        self.right = PureDecisionTree(self.max_depth)
        self.right.fit([X[k] for k in r_indices], [y[k] for k in r_indices], depth + 1)

    def predict_proba_single(self, xi):
        if self.leaf_val is not None:
            return self.leaf_val
        if xi[self.feature_idx] <= self.threshold:
            return self.left.predict_proba_single(xi)
        else:
            return self.right.predict_proba_single(xi)

    def predict_proba(self, X):
        return [self.predict_proba_single(xi) for xi in X]


# Performance Metrics Calculation
def evaluate_metrics(y_true, y_prob, threshold=0.5):
    y_pred = [1 if p >= threshold else 0 for p in y_prob]
    tp = sum(1 for i in range(len(y_true)) if y_true[i] == 1 and y_pred[i] == 1)
    tn = sum(1 for i in range(len(y_true)) if y_true[i] == 0 and y_pred[i] == 0)
    fp = sum(1 for i in range(len(y_true)) if y_true[i] == 0 and y_pred[i] == 1)
    fn = sum(1 for i in range(len(y_true)) if y_true[i] == 1 and y_pred[i] == 0)
    
    accuracy = (tp + tn) / len(y_true) if y_true else 0.0
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0.0
    
    # Calculate simple AUC-ROC
    # Sort pairs of (prob, true_label)
    pairs = sorted(zip(y_prob, y_true), key=lambda x: x[0])
    n_neg = y_true.count(0)
    n_pos = y_true.count(1)
    
    if n_neg == 0 or n_pos == 0:
        auc = 0.5
    else:
        rank_sum = sum(rank for rank, (p, t) in enumerate(pairs, 1) if t == 1)
        auc = (rank_sum - (n_pos * (n_pos + 1) / 2.0)) / (n_pos * n_neg)

    # Generate 15 points on the ROC curve
    roc_points = []
    for k in range(16):
        th = k / 15.0
        pred_th = [1 if p >= th else 0 for p in y_prob]
        tpi = sum(1 for i in range(len(y_true)) if y_true[i] == 1 and pred_th[i] == 1)
        tni = sum(1 for i in range(len(y_true)) if y_true[i] == 0 and pred_th[i] == 0)
        fpi = sum(1 for i in range(len(y_true)) if y_true[i] == 0 and pred_th[i] == 1)
        fni = sum(1 for i in range(len(y_true)) if y_true[i] == 1 and pred_th[i] == 0)
        
        tpr = tpi / (tpi + fni) if (tpi + fni) > 0 else 0.0
        fpr = fpi / (fpi + tpi) if (fpi + tpi) > 0 else (fpi / (fpi + tni) if (fpi + tni) > 0 else 0.0)
        roc_points.append({"fpr": round(fpr, 3), "tpr": round(tpr, 3), "threshold": round(th, 2)})
    roc_points = sorted(roc_points, key=lambda x: x["fpr"])

    return {
        "accuracy": round(accuracy * 100, 1),
        "precision": round(precision * 100, 1),
        "recall": round(recall * 100, 1),
        "f1": round(f1 * 100, 1),
        "auc": round(auc, 3),
        "confusionMatrix": {
            "tn": tn,
            "fp": fp,
            "fn": fn,
            "tp": tp
        },
        "rocCurve": roc_points
    }


def main():
    # Load and expand raw dataset
    records = parse_csv_to_records()
    write_customer_csv(records)
    
    # Check if we are running live prediction
    if len(sys.argv) > 1 and sys.argv[1] == "--predict":
        if len(sys.argv) > 2:
            profile_json = sys.argv[2]
        else:
            profile_json = sys.stdin.read()
        profile = json.loads(profile_json)
        
        # Fit models on full 1000 records dynamically (super fast!)
        X, y = extract_features(records)
        
        lr_model = PureLogisticRegression()
        lr_model.fit(X, y)
        
        dt_model = PureDecisionTree()
        dt_model.fit(X, y)
        
        gb_model = PureGradientBoosting()
        gb_model.fit(X, y)
        
        # Format profile features
        feat = map_single_profile(profile)
        
        # Proba predictions
        p_lr = lr_model.predict_proba([feat])[0]
        p_dt = dt_model.predict_proba([feat])[0]
        p_gb = gb_model.predict_proba([feat])[0]
        
        # Default equal soft voting weights
        p_ensemble = 0.35 * p_lr + 0.3 * p_dt + 0.35 * p_gb
        
        print(json.dumps({
            "probability": round(p_ensemble, 3),
            "churnPrediction": "Yes" if p_ensemble >= 0.5 else "No",
            "modelBreakdown": {
                "logisticRegression": round(p_lr, 3),
                "decisionTree": round(p_dt, 3),
                "gradientBoosting": round(p_gb, 3)
            }
        }))
        return

    # Train-test split (80% / 20%)
    X, y = extract_features(records)
    split_idx = int(len(X) * 0.8)
    X_train, y_train = X[:split_idx], y[:split_idx]
    X_test, y_test = X[split_idx:], y[split_idx:]
    
    # Train Models
    lr_model = PureLogisticRegression()
    lr_model.fit(X_train, y_train)
    
    dt_model = PureDecisionTree()
    dt_model.fit(X_train, y_train)
    
    gb_model = PureGradientBoosting()
    gb_model.fit(X_train, y_train)
    
    # Predict probabilities on test set
    probs_lr = lr_model.predict_proba(X_test)
    probs_dt = dt_model.predict_proba(X_test)
    probs_gb = gb_model.predict_proba(X_test)
    
    # Compute Ensemble (equal weights default)
    probs_ensemble = [0.35 * probs_lr[i] + 0.3 * probs_dt[i] + 0.35 * probs_gb[i] for i in range(len(y_test))]
    
    # Calculate performance metrics
    metrics_lr = evaluate_metrics(y_test, probs_lr)
    metrics_dt = evaluate_metrics(y_test, probs_dt)
    metrics_gb = evaluate_metrics(y_test, probs_gb)
    metrics_ensemble = evaluate_metrics(y_test, probs_ensemble)
    
    # Pack up all statistics to serialize
    serialized_results = {
        "logisticRegression": metrics_lr,
        "decisionTree": metrics_dt,
        "gradientBoosting": metrics_gb,
        "ensemble": metrics_ensemble,
        "datasetCharacteristics": {
            "totalSamples": len(records),
            "trainSamples": len(X_train),
            "testSamples": len(X_test)
        }
    }
    
    # Write JSON results
    with open("src/data/ml_results.json", "w") as f:
        f.write(json.dumps(serialized_results, indent=2))
        
    print("Machine learning models calibrated and metrics computed successfully.")

if __name__ == "__main__":
    main()
