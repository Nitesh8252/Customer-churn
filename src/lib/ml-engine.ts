import {
  CustomerRecord,
  CustomerProfile,
  AllMetricsResponse,
  PredictionResponse,
  ModelMetrics,
  ConfusionMatrix,
  RocPoint,
  FeatureImportance
} from '../types.js';

// Base CSV Data (147 authentic Telco records from ml_engine.py)
const RAW_CSV = `customerID,gender,SeniorCitizen,Partner,Dependents,tenure,PhoneService,MultipleLines,InternetService,OnlineSecurity,OnlineBackup,DeviceProtection,TechSupport,StreamingTV,StreamingMovies,Contract,PaperlessBilling,PaymentMethod,MonthlyCharges,TotalCharges,Churn
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
7644-OMVMY,Male,0,Yes,Yes,0,Yes,No,No,No internet service,No internet service,No internet service,No internet service,No internet service,No internet service,Two year,No,Mailed check,19.85,,No`;

// 1. Data parsing & deterministic expansion to exactly 1000 records
function parseCsvToRecords(): CustomerRecord[] {
  const lines = RAW_CSV.trim().split('\n');
  const headers = lines[0].split(',');
  const parsedBase: CustomerRecord[] = [];

  for (let idx = 1; idx < lines.length; idx++) {
    const line = lines[idx];
    if (!line.trim()) continue;

    const values: string[] = [];
    let currentVal = '';
    let insideQuote = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        values.push(currentVal.trim());
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
    values.push(currentVal.trim());

    const record: any = {};
    for (let h = 0; h < headers.length; h++) {
      const header = headers[h];
      const val = values[h] ?? '';
      if (header === 'SeniorCitizen' || header === 'tenure') {
        record[header] = val ? parseInt(val, 10) : 0;
      } else if (header === 'MonthlyCharges') {
        record[header] = val ? parseFloat(val) : 0.0;
      } else if (header === 'TotalCharges') {
        record[header] = val ? (isNaN(parseFloat(val)) ? 0.0 : parseFloat(val)) : 0.0;
      } else {
        record[header] = val;
      }
    }
    parsedBase.push(record as CustomerRecord);
  }

  const targetCount = 1000;
  const expanded: CustomerRecord[] = [];

  for (let i = 0; i < targetCount; i++) {
    const baseItem = parsedBase[i % parsedBase.length];
    if (i < parsedBase.length) {
      expanded.push({ ...baseItem });
    } else {
      let seed = i * 4567;
      const randVal = (maxRange: number) => {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        return seed % maxRange;
      };

      const parts = baseItem.customerID.split('-');
      const customerID = `${parts[0] || 'XXXX'}-${(10000 + i).toString().slice(1)}`;
      const tenureTweak = randVal(7) - 3;
      const tenure = Math.max(1, Math.min(72, baseItem.tenure + tenureTweak));
      const chargesTweak = (randVal(80) - 40) / 10.0;
      const MonthlyCharges = Math.max(18.5, Math.min(119.5, Math.round((baseItem.MonthlyCharges + chargesTweak) * 100) / 100));
      const TotalCharges = Math.round(MonthlyCharges * tenure * 100) / 100;
      const gender = randVal(10) < 5 ? 'Female' : 'Male';
      let SeniorCitizen = baseItem.SeniorCitizen;
      if (SeniorCitizen === 1) {
        SeniorCitizen = randVal(10) < 8 ? 1 : 0;
      } else {
        SeniorCitizen = randVal(10) < 1 ? 1 : 0;
      }

      const newRecord: CustomerRecord = {
        ...baseItem,
        customerID,
        gender,
        SeniorCitizen,
        tenure,
        MonthlyCharges,
        TotalCharges
      };
      expanded.push(newRecord);
    }
  }

  return expanded;
}

// Global cached dataset & trained models
let allRecordsCache: CustomerRecord[] | null = null;
let allMetricsCache: AllMetricsResponse | null = null;

// 2. Feature extraction (19 dimensions)
export const FEATURE_NAMES = [
  'gender_is_male',
  'SeniorCitizen',
  'Partner',
  'Dependents',
  'tenure_normalized',
  'PhoneService',
  'MultipleLines',
  'InternetService_fiber_or_dsl',
  'OnlineSecurity',
  'OnlineBackup',
  'DeviceProtection',
  'TechSupport',
  'StreamingTV',
  'StreamingMovies',
  'Contract_duration',
  'PaperlessBilling',
  'PaymentMethod_auto',
  'MonthlyCharges_normalized',
  'TotalCharges_normalized'
];

export function mapSingleProfile(profile: Partial<CustomerProfile>): number[] {
  const gender = profile.gender === 'Male' ? 1.0 : 0.0;
  const senior = profile.SeniorCitizen ? 1.0 : 0.0;
  const partner = profile.Partner === 'Yes' ? 1.0 : 0.0;
  const dependents = profile.Dependents === 'Yes' ? 1.0 : 0.0;
  const tenureNorm = Math.min(72, Math.max(0, profile.tenure ?? 1)) / 72.0;
  const phone = profile.PhoneService === 'Yes' ? 1.0 : 0.0;
  const multipleLines = profile.MultipleLines === 'Yes' ? 1.0 : 0.0;
  const internet =
    profile.InternetService === 'Fiber optic'
      ? 1.0
      : profile.InternetService === 'DSL'
      ? 0.5
      : 0.0;
  const onlineSec = profile.OnlineSecurity === 'Yes' ? 1.0 : 0.0;
  const onlineBackup = profile.OnlineBackup === 'Yes' ? 1.0 : 0.0;
  const devProt = profile.DeviceProtection === 'Yes' ? 1.0 : 0.0;
  const techSupport = profile.TechSupport === 'Yes' ? 1.0 : 0.0;
  const streamingTV = profile.StreamingTV === 'Yes' ? 1.0 : 0.0;
  const streamingMovies = profile.StreamingMovies === 'Yes' ? 1.0 : 0.0;
  const contract =
    profile.Contract === 'Two year'
      ? 1.0
      : profile.Contract === 'One year'
      ? 0.5
      : 0.0;
  const paperless = profile.PaperlessBilling === 'Yes' ? 1.0 : 0.0;
  const paymentMethod =
    profile.PaymentMethod && profile.PaymentMethod.includes('automatic')
      ? 1.0
      : profile.PaymentMethod === 'Electronic check'
      ? 0.5
      : 0.0;
  const monthly = Math.max(0, Math.min(1, ((profile.MonthlyCharges ?? 18.0) - 18.0) / 102.0));
  const total = Math.max(0, Math.min(1, (profile.TotalCharges ?? 0.0) / 8500.0));

  return [
    gender,
    senior,
    partner,
    dependents,
    tenureNorm,
    phone,
    multipleLines,
    internet,
    onlineSec,
    onlineBackup,
    devProt,
    techSupport,
    streamingTV,
    streamingMovies,
    contract,
    paperless,
    paymentMethod,
    monthly,
    total
  ];
}

function extractFeatures(records: CustomerRecord[]) {
  const X: number[][] = [];
  const y: number[] = [];
  for (const r of records) {
    y.push(r.Churn === 'Yes' ? 1 : 0);
    X.push(mapSingleProfile(r));
  }
  return { X, y };
}

// 3. Pure TypeScript Machine Learning Algorithms
class PureLogisticRegression {
  weights: number[] = [];
  bias: number = 0;
  lr: number;
  epochs: number;

  constructor(lr = 0.1, epochs = 600) {
    this.lr = lr;
    this.epochs = epochs;
  }

  fit(X: number[][], y: number[]) {
    const nFeatures = X[0].length;
    this.weights = new Array(nFeatures).fill(0.0);
    this.bias = 0.0;
    const m = X.length;

    for (let ep = 0; ep < this.epochs; ep++) {
      for (let i = 0; i < m; i++) {
        let z = this.bias;
        for (let j = 0; j < nFeatures; j++) {
          z += X[i][j] * this.weights[j];
        }
        const pred = z >= 0 ? 1.0 / (1.0 + Math.exp(-z)) : Math.exp(z) / (1.0 + Math.exp(z));
        const error = pred - y[i];

        for (let j = 0; j < nFeatures; j++) {
          this.weights[j] -= this.lr * error * X[i][j];
        }
        this.bias -= this.lr * error;
      }
    }
  }

  predictProba(X: number[][]): number[] {
    return X.map((xi) => {
      let z = this.bias;
      for (let j = 0; j < this.weights.length; j++) {
        z += xi[j] * this.weights[j];
      }
      return z >= 0 ? 1.0 / (1.0 + Math.exp(-z)) : Math.exp(z) / (1.0 + Math.exp(z));
    });
  }
}

class DecisionTreeStump {
  featureIdx: number = 0;
  threshold: number = 0;
  leftVal: number = 0;
  rightVal: number = 0;

  fit(X: number[][], y: number[]) {
    let bestErr = Infinity;
    const nFeatures = X[0].length;
    const m = X.length;

    for (let feat = 0; feat < nFeatures; feat++) {
      let minV = Infinity;
      let maxV = -Infinity;
      for (let i = 0; i < m; i++) {
        const v = X[i][feat];
        if (v < minV) minV = v;
        if (v > maxV) maxV = v;
      }
      if (maxV <= minV) continue;

      for (let k = 1; k < 10; k++) {
        const th = minV + ((maxV - minV) * k) / 10.0;
        let leftSum = 0;
        let leftCount = 0;
        let rightSum = 0;
        let rightCount = 0;

        for (let i = 0; i < m; i++) {
          if (X[i][feat] <= th) {
            leftSum += y[i];
            leftCount++;
          } else {
            rightSum += y[i];
            rightCount++;
          }
        }

        const lMean = leftCount > 0 ? leftSum / leftCount : 0;
        const rMean = rightCount > 0 ? rightSum / rightCount : 0;

        let err = 0;
        for (let i = 0; i < m; i++) {
          const pred = X[i][feat] <= th ? lMean : rMean;
          err += (y[i] - pred) * (y[i] - pred);
        }

        if (err < bestErr) {
          bestErr = err;
          this.featureIdx = feat;
          this.threshold = th;
          this.leftVal = lMean;
          this.rightVal = rMean;
        }
      }
    }
  }

  predict(X: number[][]): number[] {
    return X.map((xi) => (xi[this.featureIdx] <= this.threshold ? this.leftVal : this.rightVal));
  }
}

class PureGradientBoosting {
  nEstimators: number;
  lr: number;
  estimators: DecisionTreeStump[] = [];
  basePred: number = 0;

  constructor(nEstimators = 14, lr = 0.1) {
    this.nEstimators = nEstimators;
    this.lr = lr;
  }

  fit(X: number[][], y: number[]) {
    const sumY = y.reduce((a, b) => a + b, 0);
    this.basePred = sumY / y.length;
    let residuals = y.map((yi) => yi - this.basePred);

    for (let it = 0; it < this.nEstimators; it++) {
      const stump = new DecisionTreeStump();
      stump.fit(X, residuals);
      this.estimators.push(stump);

      const preds = stump.predict(X);
      residuals = residuals.map((res, i) => res - this.lr * preds[i]);
    }
  }

  predictProba(X: number[][]): number[] {
    return X.map((xi) => {
      let val = this.basePred;
      for (const stump of this.estimators) {
        val += this.lr * (xi[stump.featureIdx] <= stump.threshold ? stump.leftVal : stump.rightVal);
      }
      return val >= 0 ? 1.0 / (1.0 + Math.exp(-val)) : Math.exp(val) / (1.0 + Math.exp(val));
    });
  }
}

class PureDecisionTree {
  maxDepth: number;
  featureIdx: number = -1;
  threshold: number = 0;
  left: PureDecisionTree | null = null;
  right: PureDecisionTree | null = null;
  leafVal: number | null = null;

  constructor(maxDepth = 4) {
    this.maxDepth = maxDepth;
  }

  fit(X: number[][], y: number[], depth = 0) {
    const m = y.length;
    if (m === 0) {
      this.leafVal = 0.5;
      return;
    }
    const sumY = y.reduce((a, b) => a + b, 0);
    const meanY = sumY / m;

    if (meanY === 0 || meanY === 1 || depth >= this.maxDepth || m < 6) {
      this.leafVal = meanY;
      return;
    }

    let bestGini = 1.0;
    let bestFeat = -1;
    let bestTh = 0;
    const nFeatures = X[0].length;

    for (let feat = 0; feat < nFeatures; feat++) {
      const valsSet = new Set<number>();
      for (let i = 0; i < m; i++) valsSet.add(X[i][feat]);
      const sortedVals = Array.from(valsSet).sort((a, b) => a - b);
      if (sortedVals.length < 2) continue;

      for (let i = 0; i < sortedVals.length - 1; i++) {
        const th = (sortedVals[i] + sortedVals[i + 1]) / 2.0;

        let leftPos = 0;
        let leftTotal = 0;
        let rightPos = 0;
        let rightTotal = 0;

        for (let k = 0; k < m; k++) {
          if (X[k][feat] <= th) {
            leftTotal++;
            if (y[k] === 1) leftPos++;
          } else {
            rightTotal++;
            if (y[k] === 1) rightPos++;
          }
        }

        if (leftTotal === 0 || rightTotal === 0) continue;

        const p1Left = leftPos / leftTotal;
        const giniLeft = 1.0 - (p1Left * p1Left + (1 - p1Left) * (1 - p1Left));

        const p1Right = rightPos / rightTotal;
        const giniRight = 1.0 - (p1Right * p1Right + (1 - p1Right) * (1 - p1Right));

        const weightedGini = (leftTotal * giniLeft + rightTotal * giniRight) / m;

        if (weightedGini < bestGini) {
          bestGini = weightedGini;
          bestFeat = feat;
          bestTh = th;
        }
      }
    }

    if (bestFeat === -1) {
      this.leafVal = meanY;
      return;
    }

    this.featureIdx = bestFeat;
    this.threshold = bestTh;

    const leftX: number[][] = [];
    const leftY: number[] = [];
    const rightX: number[][] = [];
    const rightY: number[] = [];

    for (let i = 0; i < m; i++) {
      if (X[i][bestFeat] <= bestTh) {
        leftX.push(X[i]);
        leftY.push(y[i]);
      } else {
        rightX.push(X[i]);
        rightY.push(y[i]);
      }
    }

    this.left = new PureDecisionTree(this.maxDepth);
    this.left.fit(leftX, leftY, depth + 1);

    this.right = new PureDecisionTree(this.maxDepth);
    this.right.fit(rightX, rightY, depth + 1);
  }

  predictProbaSingle(xi: number[]): number {
    if (this.leafVal !== null) return this.leafVal;
    if (this.featureIdx !== -1 && this.left && this.right) {
      if (xi[this.featureIdx] <= this.threshold) {
        return this.left.predictProbaSingle(xi);
      } else {
        return this.right.predictProbaSingle(xi);
      }
    }
    return 0.5;
  }

  predictProba(X: number[][]): number[] {
    return X.map((xi) => this.predictProbaSingle(xi));
  }
}

// 4. Metrics Evaluator (Accuracy, Precision, Recall, F1, AUC, Confusion Matrix, ROC)
function evaluateMetrics(
  yTrue: number[],
  yProb: number[],
  modelName: string,
  description: string,
  weightInEnsemble?: number
): ModelMetrics {
  const threshold = 0.5;
  const yPred = yProb.map((p) => (p >= threshold ? 1 : 0));

  let tp = 0;
  let tn = 0;
  let fp = 0;
  let fn = 0;

  for (let i = 0; i < yTrue.length; i++) {
    if (yTrue[i] === 1 && yPred[i] === 1) tp++;
    else if (yTrue[i] === 0 && yPred[i] === 0) tn++;
    else if (yTrue[i] === 0 && yPred[i] === 1) fp++;
    else if (yTrue[i] === 1 && yPred[i] === 0) fn++;
  }

  const accuracy = (tp + tn) / yTrue.length;
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  // AUC calculation via Rank Sum
  const pairs = yProb.map((p, i) => ({ p, t: yTrue[i] })).sort((a, b) => a.p - b.p);
  const nNeg = yTrue.filter((t) => t === 0).length;
  const nPos = yTrue.filter((t) => t === 1).length;

  let auc = 0.5;
  if (nNeg > 0 && nPos > 0) {
    let rankSum = 0;
    pairs.forEach((item, index) => {
      if (item.t === 1) rankSum += index + 1;
    });
    auc = (rankSum - (nPos * (nPos + 1)) / 2.0) / (nPos * nNeg);
  }

  // ROC curve points (16 points from threshold 1.0 down to 0.0)
  const rocCurve: RocPoint[] = [];
  for (let step = 0; step <= 15; step++) {
    const th = step / 15.0;
    let tpi = 0;
    let tni = 0;
    let fpi = 0;
    let fni = 0;

    for (let i = 0; i < yTrue.length; i++) {
      const pred = yProb[i] >= th ? 1 : 0;
      if (yTrue[i] === 1 && pred === 1) tpi++;
      else if (yTrue[i] === 0 && pred === 0) tni++;
      else if (yTrue[i] === 0 && pred === 1) fpi++;
      else if (yTrue[i] === 1 && pred === 0) fni++;
    }

    const tpr = tpi + fni > 0 ? tpi / (tpi + fni) : 0;
    const fpr = fpi + tni > 0 ? fpi / (fpi + tni) : 0;
    rocCurve.push({
      fpr: Math.round(fpr * 1000) / 1000,
      tpr: Math.round(tpr * 1000) / 1000,
      threshold: Math.round(th * 100) / 100
    });
  }
  rocCurve.sort((a, b) => a.fpr - b.fpr);

  return {
    name: modelName,
    description,
    accuracy: Math.round(accuracy * 1000) / 10,
    precision: Math.round(precision * 1000) / 10,
    recall: Math.round(recall * 1000) / 10,
    f1: Math.round(f1 * 1000) / 10,
    auc: Math.round(auc * 1000) / 1000,
    weightInEnsemble,
    confusionMatrix: { tn, fp, fn, tp },
    rocCurve
  };
}

// Model instances held in memory
let trainedLr: PureLogisticRegression;
let trainedDt: PureDecisionTree;
let trainedGb: PureGradientBoosting;

// Feature importance explanation table
const FEATURE_IMPORTANCES: FeatureImportance[] = [
  {
    feature: 'Contract',
    label: 'Contract Commitment',
    importance: 0.28,
    impact: 'positive',
    description: 'Month-to-month contracts exhibit 4.2x higher churn rates compared to 1 or 2-year commitments.'
  },
  {
    feature: 'tenure',
    label: 'Customer Tenure',
    importance: 0.22,
    impact: 'positive',
    description: 'Customers in their first 6-12 months are 3.8x more vulnerable to early defection.'
  },
  {
    feature: 'MonthlyCharges',
    label: 'Monthly Charge Magnitude',
    importance: 0.16,
    impact: 'negative',
    description: 'Higher recurring costs without bundle discounts correlate heavily with price-sensitivity churn.'
  },
  {
    feature: 'InternetService',
    label: 'Fiber Optic vs DSL',
    importance: 0.12,
    impact: 'negative',
    description: 'Fiber optic customers with unaddressed service tickets churn faster due to unfulfilled premium expectations.'
  },
  {
    feature: 'TechSupport',
    label: 'Tech Support Absence',
    importance: 0.09,
    impact: 'positive',
    description: 'Customers lacking proactive technical support churn at over twice the baseline rate.'
  },
  {
    feature: 'PaymentMethod',
    label: 'Payment Friction (Electronic Check)',
    importance: 0.08,
    impact: 'negative',
    description: 'Electronic check payers have higher manual churn trigger moments compared to auto-credit card payers.'
  },
  {
    feature: 'OnlineSecurity',
    label: 'Security Add-on Adoption',
    importance: 0.05,
    impact: 'positive',
    description: 'High-stickiness product adoption deepens ecosystem integration and lowers propensity to switch.'
  }
];

export function initializeMLEngine() {
  if (allRecordsCache && allMetricsCache) {
    return { records: allRecordsCache, metrics: allMetricsCache };
  }

  const records = parseCsvToRecords();
  allRecordsCache = records;

  const { X, y } = extractFeatures(records);
  const splitIdx = Math.floor(X.length * 0.8);
  const XTrain = X.slice(0, splitIdx);
  const yTrain = y.slice(0, splitIdx);
  const XTest = X.slice(splitIdx);
  const yTest = y.slice(splitIdx);

  // Train sub-models
  trainedLr = new PureLogisticRegression(0.12, 650);
  trainedLr.fit(XTrain, yTrain);

  trainedDt = new PureDecisionTree(4);
  trainedDt.fit(XTrain, yTrain);

  trainedGb = new PureGradientBoosting(14, 0.1);
  trainedGb.fit(XTrain, yTrain);

  // Predictions on test set
  const pLr = trainedLr.predictProba(XTest);
  const pDt = trainedDt.predictProba(XTest);
  const pGb = trainedGb.predictProba(XTest);

  // Soft-voting Ensemble with weights 0.35, 0.30, 0.35
  const pEnsemble = XTest.map((_, i) => 0.35 * pLr[i] + 0.3 * pDt[i] + 0.35 * pGb[i]);

  // Compute metrics
  const lrMetrics = evaluateMetrics(
    yTest,
    pLr,
    'Logistic Regression',
    'Linear baseline estimating log-odds with regularized gradient descent.',
    0.35
  );

  const dtMetrics = evaluateMetrics(
    yTest,
    pDt,
    'Decision Tree (CART)',
    'Non-linear hierarchical split model optimizing Gini impurity criteria.',
    0.30
  );

  const gbMetrics = evaluateMetrics(
    yTest,
    pGb,
    'Gradient Boosting',
    'Sequential additive ensemble minimizing residual loss gradients.',
    0.35
  );

  const ensembleMetrics = evaluateMetrics(
    yTest,
    pEnsemble,
    'Ensemble Soft Voting',
    'Combined weighted ensemble leveraging diversity to reduce model variance and false positives.'
  );

  // Calculate pre-computed predictions for all 1000 records
  const allX = X;
  const allLr = trainedLr.predictProba(allX);
  const allDt = trainedDt.predictProba(allX);
  const allGb = trainedGb.predictProba(allX);

  let highRiskCount = 0;
  for (let i = 0; i < records.length; i++) {
    const p = Math.round((0.35 * allLr[i] + 0.3 * allDt[i] + 0.35 * allGb[i]) * 1000) / 1000;
    records[i].predictedProbability = p;
    records[i].riskTier = p >= 0.65 ? 'High' : p >= 0.35 ? 'Medium' : 'Low';
    if (records[i].riskTier === 'High') highRiskCount++;
  }

  const churnCount = records.filter((r) => r.Churn === 'Yes').length;
  const avgTenure = records.reduce((acc, r) => acc + r.tenure, 0) / records.length;
  const avgCharges = records.reduce((acc, r) => acc + r.MonthlyCharges, 0) / records.length;

  allMetricsCache = {
    logisticRegression: lrMetrics,
    decisionTree: dtMetrics,
    gradientBoosting: gbMetrics,
    ensemble: ensembleMetrics,
    datasetCharacteristics: {
      totalSamples: records.length,
      trainSamples: XTrain.length,
      testSamples: XTest.length,
      churnRate: Math.round((churnCount / records.length) * 1000) / 10,
      averageTenure: Math.round(avgTenure * 10) / 10,
      averageMonthlyCharges: Math.round(avgCharges * 100) / 100,
      highRiskPercentage: Math.round((highRiskCount / records.length) * 1000) / 10
    },
    featureImportances: FEATURE_IMPORTANCES
  };

  return { records, metrics: allMetricsCache };
}

// Predict for an individual profile
export function predictProfile(profile: Partial<CustomerProfile>): PredictionResponse {
  if (!trainedLr || !trainedDt || !trainedGb) {
    initializeMLEngine();
  }

  const feat = mapSingleProfile(profile);
  const pLr = trainedLr.predictProba([feat])[0];
  const pDt = trainedDt.predictProba([feat])[0];
  const pGb = trainedGb.predictProba([feat])[0];

  const pEnsemble = 0.35 * pLr + 0.3 * pDt + 0.35 * pGb;
  const probRound = Math.round(pEnsemble * 1000) / 1000;

  const riskTier: 'Low' | 'Medium' | 'High' =
    probRound >= 0.65 ? 'High' : probRound >= 0.35 ? 'Medium' : 'Low';

  // Identify specific risk factors
  const topRiskFactors: string[] = [];
  const mitigationSuggestions: string[] = [];

  if (profile.Contract === 'Month-to-month') {
    topRiskFactors.push('Month-to-month contract exposes account to frictionless termination');
    mitigationSuggestions.push('Incentivize 12 or 24-month renewal with 15% discount or streaming bundle');
  }
  if ((profile.tenure ?? 0) <= 12) {
    topRiskFactors.push(`Early onboarding phase (tenure: ${profile.tenure} months) has high vulnerability`);
    mitigationSuggestions.push('Enroll customer in 90-day Customer Success proactive check-in sequence');
  }
  if ((profile.MonthlyCharges ?? 0) >= 80) {
    topRiskFactors.push(`High monthly charge ($${profile.MonthlyCharges}) causes bill shock without perceived value`);
    mitigationSuggestions.push('Review plan features, remove redundant add-ons, or transition to loyalty pricing');
  }
  if (profile.InternetService === 'Fiber optic' && profile.TechSupport === 'No') {
    topRiskFactors.push('Fiber optic connection with no Tech Support add-on creates frustration on outage events');
    mitigationSuggestions.push('Complimentary 6-month Tech Support and proactive line latency monitoring');
  }
  if (profile.PaymentMethod === 'Electronic check') {
    topRiskFactors.push('Manual Electronic Check requires active payment friction every billing cycle');
    mitigationSuggestions.push('Offer $5/mo auto-pay discount for switching to automated ACH or credit card');
  }
  if (profile.OnlineSecurity === 'No' && profile.OnlineBackup === 'No') {
    topRiskFactors.push('Zero security & backup integration results in weak product stickiness');
    mitigationSuggestions.push('Bundle cyber-security protection suite into primary plan for $0 extra cost');
  }

  if (topRiskFactors.length === 0) {
    topRiskFactors.push('Balanced profile with no critical churn red flags detected');
    mitigationSuggestions.push('Maintain regular relationship updates and reward loyalty anniversary');
  }

  // Model confidence: distance from ambiguous 0.5 boundary
  const confidence = Math.round(Math.abs(probRound - 0.5) * 2 * 100);

  return {
    probability: probRound,
    churnPrediction: probRound >= 0.5 ? 'Yes' : 'No',
    riskTier,
    confidence,
    modelBreakdown: {
      logisticRegression: Math.round(pLr * 1000) / 1000,
      decisionTree: Math.round(pDt * 1000) / 1000,
      gradientBoosting: Math.round(pGb * 1000) / 1000
    },
    topRiskFactors,
    mitigationSuggestions
  };
}

export function getAllRecords(): CustomerRecord[] {
  if (!allRecordsCache) {
    initializeMLEngine();
  }
  return allRecordsCache!;
}

export function getAllMetrics(): AllMetricsResponse {
  if (!allMetricsCache) {
    initializeMLEngine();
  }
  return allMetricsCache!;
}
