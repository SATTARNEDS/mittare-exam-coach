"use strict";

const questionBank = [
  {id:1,topic:"พ.ร.บ. รถยนต์",q:"วัตถุประสงค์สำคัญของ พ.ร.บ.คุ้มครองผู้ประสบภัยจากรถ คือข้อใด?",o:["ชดใช้ค่าซ่อมรถทุกคัน","ให้ผู้ประสบภัยได้รับการชดใช้ต่อชีวิต ร่างกาย หรืออนามัยอย่างรวดเร็ว","รับประกันคุณภาพรถยนต์","ชดใช้สินค้าที่บรรทุกในรถ"],a:"ให้ผู้ประสบภัยได้รับการชดใช้ต่อชีวิต ร่างกาย หรืออนามัยอย่างรวดเร็ว",e:"พ.ร.บ. มุ่งคุ้มครองคน ไม่ใช่ตัวรถหรือทรัพย์สิน"},
  {id:2,topic:"พ.ร.บ. รถยนต์",q:"พ.ร.บ. รถยนต์เป็นการประกันภัยประเภทใด?",o:["ภาคสมัครใจ","ภาคบังคับ","ประกันชีวิต","ประกันทรัพย์สินภายในบ้าน"],a:"ภาคบังคับ",e:"เจ้าของรถหรือผู้มีหน้าที่ตามกฎหมายต้องจัดให้รถมีประกันภัยภาคบังคับ"},
  {id:3,topic:"พ.ร.บ. รถยนต์",q:"ข้อใดเป็นความเสียหายที่ พ.ร.บ. รถยนต์ไม่คุ้มครอง?",o:["ค่ารักษาพยาบาลผู้โดยสาร","การเสียชีวิตของบุคคลภายนอก","ค่าซ่อมรถคู่กรณี","การสูญเสียอวัยวะ"],a:"ค่าซ่อมรถคู่กรณี",e:"พ.ร.บ. คุ้มครองชีวิต ร่างกาย และอนามัย ไม่คุ้มครองความเสียหายต่อทรัพย์สิน"},
  {id:4,topic:"พ.ร.บ. รถยนต์",q:"ค่าเสียหายเบื้องต้นกรณีบาดเจ็บ จ่ายค่ารักษาพยาบาลตามจริงไม่เกินเท่าใดต่อคน?",o:["20,000 บาท","30,000 บาท","35,000 บาท","80,000 บาท"],a:"30,000 บาท",e:"ค่าเสียหายเบื้องต้นค่ารักษาพยาบาลจ่ายตามจริงไม่เกิน 30,000 บาทต่อคน"},
  {id:5,topic:"พ.ร.บ. รถยนต์",q:"ค่าเสียหายเบื้องต้นกรณีเสียชีวิตมีจำนวนเท่าใดต่อคน?",o:["30,000 บาท","35,000 บาท","80,000 บาท","500,000 บาท"],a:"35,000 บาท",e:"กรณีเสียชีวิต ค่าเสียหายเบื้องต้นกำหนดไว้ 35,000 บาทต่อคน"},
  {id:6,topic:"พ.ร.บ. รถยนต์",q:"ผู้ประสบภัยรักษาพยาบาลแล้วเสียชีวิต ค่าเสียหายเบื้องต้นรวมกันไม่เกินเท่าใด?",o:["35,000 บาท","50,000 บาท","65,000 บาท","80,000 บาท"],a:"65,000 บาท",e:"ค่ารักษาไม่เกิน 30,000 บาท รวมกับกรณีเสียชีวิต 35,000 บาท รวมไม่เกิน 65,000 บาท"},
  {id:7,topic:"พ.ร.บ. รถยนต์",q:"การรับค่าเสียหายเบื้องต้นต้องรอพิสูจน์ว่าใครเป็นฝ่ายผิดหรือไม่?",o:["ต้องรอคำพิพากษาถึงที่สุด","ต้องรอผลตำรวจเท่านั้น","ไม่ต้องรอพิสูจน์ความผิด","ต้องให้คู่กรณียอมรับก่อน"],a:"ไม่ต้องรอพิสูจน์ความผิด",e:"หลักสำคัญคือช่วยเหลือผู้ประสบภัยอย่างรวดเร็วก่อนพิสูจน์ความรับผิด"},
  {id:8,topic:"พ.ร.บ. รถยนต์",q:"บุคคลใดถือเป็นผู้ประสบภัยตาม พ.ร.บ.?",o:["เฉพาะเจ้าของรถ","เฉพาะผู้ขับขี่ฝ่ายถูก","ผู้ได้รับอันตรายต่อชีวิต ร่างกาย หรืออนามัยเนื่องจากรถ","เฉพาะผู้ที่มีใบขับขี่"],a:"ผู้ได้รับอันตรายต่อชีวิต ร่างกาย หรืออนามัยเนื่องจากรถ",e:"นิยามไม่ได้จำกัดเฉพาะเจ้าของรถ ผู้ขับขี่ หรือผู้มีใบขับขี่"},
  {id:9,topic:"พ.ร.บ. รถยนต์",q:"ทายาทโดยธรรมของผู้ประสบภัยที่เสียชีวิตอยู่ในความหมายของผู้ประสบภัยหรือไม่?",o:["อยู่","ไม่อยู่","อยู่เฉพาะเมื่อเป็นเจ้าของรถ","อยู่เฉพาะเมื่อศาลสั่ง"],a:"อยู่",e:"กฎหมายรวมทายาทโดยธรรมของผู้ประสบภัยซึ่งถึงแก่ความตายไว้ด้วย"},
  {id:10,topic:"พ.ร.บ. รถยนต์",q:"ผู้ขับขี่รถคันที่ก่อเหตุและเป็นฝ่ายผิด จะเรียกร้องจาก พ.ร.บ. ของรถคันที่ตนขับได้เพียงใด?",o:["ไม่ได้รับสิทธิใดเลย","ได้รับเฉพาะค่าเสียหายเบื้องต้น","ได้รับค่าซ่อมรถเต็มจำนวน","ได้รับ 500,000 บาททุกกรณี"],a:"ได้รับเฉพาะค่าเสียหายเบื้องต้น",e:"สำหรับผู้ขับขี่รถคันที่ก่อเหตุ สิทธิจาก พ.ร.บ. ของรถคันนั้นจำกัดอยู่ที่ค่าเสียหายเบื้องต้น ส่วน พ.ร.บ. ไม่คุ้มครองค่าซ่อมรถ"},
  {id:11,topic:"พ.ร.บ. รถยนต์",q:"ค่าสินไหมกรณีเสียชีวิตหรือทุพพลภาพถาวรสิ้นเชิง สำหรับผู้มีสิทธิเต็มจำนวน สูงสุดเท่าใดต่อคน?",o:["80,000 บาท","200,000 บาท","300,000 บาท","500,000 บาท"],a:"500,000 บาท",e:"วงเงินสูงสุดกรณีเสียชีวิตหรือทุพพลภาพถาวรสิ้นเชิงคือ 500,000 บาทต่อคน ตามเงื่อนไข"},
  {id:12,topic:"พ.ร.บ. รถยนต์",q:"กรณีบาดเจ็บแต่ไม่ถึงขั้นสูญเสียอวัยวะ ทุพพลภาพถาวร หรือเสียชีวิต พ.ร.บ. ชดใช้ค่าเสียหายต่อร่างกายหรืออนามัยตามจริงสูงสุดเท่าใดต่อคน?",o:["30,000 บาท","65,000 บาท","80,000 บาท","100,000 บาท"],a:"80,000 บาท",e:"ความคุ้มครองส่วนนี้ชดใช้ตามความเสียหายจริงไม่เกิน 80,000 บาทต่อคน ไม่ควรจำกัดความว่าเป็นเพียงใบเสร็จค่ารักษาพยาบาลเท่านั้น"},
  {id:13,topic:"พ.ร.บ. รถยนต์",q:"ค่าชดเชยรายวันกรณีเข้ารักษาในโรงพยาบาลในฐานะผู้ป่วยใน เป็นเท่าใด?",o:["วันละ 100 บาท ไม่เกิน 10 วัน","วันละ 200 บาท ไม่เกิน 20 วัน","วันละ 300 บาท ไม่เกิน 30 วัน","วันละ 500 บาท ไม่จำกัดวัน"],a:"วันละ 200 บาท ไม่เกิน 20 วัน",e:"เป็นค่าชดเชยรายวันเมื่อเป็นผู้ป่วยใน รวมสูงสุด 4,000 บาท"},
  {id:14,topic:"พ.ร.บ. รถยนต์",q:"เมื่อรถที่ก่อเหตุไม่มี พ.ร.บ. ผู้ประสบภัยอาจขอค่าเสียหายเบื้องต้นจากที่ใด?",o:["กองทุนทดแทนผู้ประสบภัย","กรมการขนส่งทางบกเท่านั้น","กองทุนประกันสังคมเท่านั้น","บริษัทผู้ผลิตรถ"],a:"กองทุนทดแทนผู้ประสบภัย",e:"กองทุนมีบทบาทช่วยจ่ายค่าเสียหายเบื้องต้นในกรณีที่กฎหมายกำหนด แล้วจึงไล่เบี้ยผู้มีหน้าที่"},
  {id:15,topic:"พ.ร.บ. รถยนต์",q:"กรณีรถหนีจนไม่ทราบว่ารถคันใดก่อเหตุ ผู้ประสบภัยควรใช้สิทธิใดตามกฎหมาย?",o:["หมดสิทธิทันที","ขอค่าเสียหายเบื้องต้นจากกองทุนทดแทนผู้ประสบภัยตามเงื่อนไข","เรียกจากบริษัทประกันทุกแห่งเฉลี่ยกัน","เรียกจากโรงพยาบาล"],a:"ขอค่าเสียหายเบื้องต้นจากกองทุนทดแทนผู้ประสบภัยตามเงื่อนไข",e:"กรณีไม่ทราบรถที่ก่อเหตุเป็นหนึ่งในกรณีที่กองทุนอาจเข้าช่วยเหลือตามหลักเกณฑ์"},
  {id:16,topic:"พ.ร.บ. รถยนต์",q:"ใครมีหน้าที่หลักในการจัดให้รถมีประกันภัยตาม พ.ร.บ.?",o:["ผู้โดยสาร","เจ้าของรถหรือผู้มีสิทธิครอบครองตามสัญญาเช่าซื้อ","พนักงานสอบสวน","โรงพยาบาล"],a:"เจ้าของรถหรือผู้มีสิทธิครอบครองตามสัญญาเช่าซื้อ",e:"กฎหมายกำหนดหน้าที่กับเจ้าของรถ และรวมผู้มีสิทธิครอบครองตามสัญญาเช่าซื้อ"},
  {id:17,topic:"พ.ร.บ. รถยนต์",q:"ข้อใดกล่าวถูกต้องเกี่ยวกับผู้โดยสารในรถฝ่ายผิด?",o:["ไม่ได้รับความคุ้มครอง","เป็นผู้ประสบภัยและมีสิทธิตามเงื่อนไข","ได้เฉพาะค่าซ่อมทรัพย์สิน","ต้องมีใบขับขี่ก่อน"],a:"เป็นผู้ประสบภัยและมีสิทธิตามเงื่อนไข",e:"ความเป็นผู้โดยสารไม่ได้ทำให้เสียสิทธิ แม้อยู่ในรถคันที่เป็นฝ่ายผิด"},
  {id:18,topic:"พ.ร.บ. รถยนต์",q:"หากมีประกันรถยนต์ประเภท 1 แล้ว ยังต้องทำ พ.ร.บ. หรือไม่?",o:["ไม่ต้อง เพราะประเภท 1 แทนกันได้","ยังต้องทำ เพราะเป็นคนละส่วนและ พ.ร.บ. เป็นภาคบังคับ","ทำเฉพาะรถใหม่","เลือกทำอย่างใดอย่างหนึ่ง"],a:"ยังต้องทำ เพราะเป็นคนละส่วนและ พ.ร.บ. เป็นภาคบังคับ",e:"ประกันภาคสมัครใจไม่ทำให้หน้าที่ตามกฎหมายเรื่องประกันภาคบังคับหมดไป"},
  {id:19,topic:"พ.ร.บ. รถยนต์",q:"พ.ร.บ. คุ้มครองความเสียหายจากสิ่งที่บรรทุกหรือติดตั้งในรถซึ่งก่ออันตรายต่อคนหรือไม่?",o:["คุ้มครองตามนิยามผู้ประสบภัย","ไม่คุ้มครองทุกกรณี","คุ้มครองเฉพาะสินค้า","คุ้มครองเฉพาะรถบรรทุก"],a:"คุ้มครองตามนิยามผู้ประสบภัย",e:"นิยามครอบคลุมอันตรายจากรถที่ใช้หรืออยู่ในทาง รวมถึงสิ่งที่บรรทุกหรือติดตั้งในรถ"},
  {id:20,topic:"พ.ร.บ. รถยนต์",q:"เหตุใดการมี พ.ร.บ. จึงไม่เพียงพอสำหรับความเสี่ยงค่าซ่อมรถคู่กรณี?",o:["เพราะ พ.ร.บ. มีอายุเพียงหนึ่งเดือน","เพราะ พ.ร.บ. ไม่คุ้มครองความเสียหายต่อทรัพย์สิน","เพราะ พ.ร.บ. ใช้เฉพาะรถบรรทุก","เพราะ พ.ร.บ. คุ้มครองเฉพาะกลางคืน"],a:"เพราะ พ.ร.บ. ไม่คุ้มครองความเสียหายต่อทรัพย์สิน",e:"จึงควรมีประกันภาคสมัครใจเพื่อรองรับความรับผิดต่อทรัพย์สินและความคุ้มครองอื่น"},

  {id:21,topic:"ประกันภาคสมัครใจ",q:"ประกันภัยรถยนต์ประเภท 1 มีลักษณะเด่นข้อใด?",o:["คุ้มครองเฉพาะบุคคลภายนอก","คุ้มครองความรับผิดต่อบุคคลภายนอกและความเสียหายต่อรถเอาประกันภัยตามเงื่อนไข","คุ้มครองเฉพาะรถหาย","คุ้มครองเฉพาะไฟไหม้"],a:"คุ้มครองความรับผิดต่อบุคคลภายนอกและความเสียหายต่อรถเอาประกันภัยตามเงื่อนไข",e:"ประเภท 1 ให้ขอบเขตกว้างที่สุดในกลุ่มมาตรฐาน แต่ยังอยู่ภายใต้เงื่อนไขและข้อยกเว้น"},
  {id:22,topic:"ประกันภาคสมัครใจ",q:"ประกันภัยรถยนต์ประเภท 2 ต่างจากประเภท 3 ที่สำคัญอย่างไร?",o:["ประเภท 2 เพิ่มรถสูญหายและไฟไหม้","ประเภท 2 ไม่คุ้มครองบุคคลภายนอก","ประเภท 2 คุ้มครองการชนรถเราเสมอ","ประเภท 2 เป็นประกันภาคบังคับ"],a:"ประเภท 2 เพิ่มรถสูญหายและไฟไหม้",e:"ทั้งสองประเภทคุ้มครองความรับผิดต่อบุคคลภายนอก แต่ประเภท 2 เพิ่มภัยสูญหายและไฟไหม้ของรถเอาประกันภัย"},
  {id:23,topic:"ประกันภาคสมัครใจ",q:"ประกันภัยรถยนต์ประเภท 3 เน้นความคุ้มครองใด?",o:["ความเสียหายต่อตัวรถเรา","รถเราสูญหาย","ความรับผิดต่อบุคคลภายนอก","เครื่องยนต์เสื่อมสภาพ"],a:"ความรับผิดต่อบุคคลภายนอก",e:"ประเภท 3 เน้นชีวิต ร่างกาย และทรัพย์สินของบุคคลภายนอกตามวงเงิน"},
  {id:24,topic:"ประกันภาคสมัครใจ",q:"กรมธรรม์รถยนต์แบบ 2+ เพิ่มความคุ้มครองส่วนใดจากประเภท 2 ตามแบบมาตรฐาน?",o:["ความเสียหายต่อรถเอาประกันภัยจากการชนกับยานพาหนะทางบกตามเงื่อนไข","ความเสียหายจากการเสื่อมสภาพทุกกรณี","ค่ารักษาของผู้ขับขี่จาก พ.ร.บ.","ความเสียหายต่อทรัพย์สินทุกชนิดโดยไม่จำกัดวงเงิน"],a:"ความเสียหายต่อรถเอาประกันภัยจากการชนกับยานพาหนะทางบกตามเงื่อนไข",e:"แบบ 2+ ยังคงส่วนสูญหายและไฟไหม้ของประเภท 2 และเพิ่มความเสียหายต่อรถเอาประกันภัยจากรถชนรถตามข้อกำหนดของกรมธรรม์"},
  {id:25,topic:"ประกันภาคสมัครใจ",q:"ตามความคุ้มครองมาตรฐานของประกันรถยนต์แบบ 3+ ข้อใดไม่ได้รวมอยู่โดยอัตโนมัติ?",o:["รถเอาประกันภัยสูญหายหรือไฟไหม้","ความรับผิดต่อชีวิตบุคคลภายนอก","ความรับผิดต่อทรัพย์สินบุคคลภายนอก","ความเสียหายต่อรถเอาประกันภัยจากรถชนรถตามเงื่อนไข"],a:"รถเอาประกันภัยสูญหายหรือไฟไหม้",e:"แบบ 3+ เพิ่มความเสียหายต่อรถเอาประกันภัยจากรถชนรถตามเงื่อนไข แต่ความสูญหายและไฟไหม้เป็นส่วนที่มีในแบบ 2+ ไม่ใช่ 3+ มาตรฐาน"},
  {id:26,topic:"ประกันภาคสมัครใจ",q:"ข้อใดเป็นตัวอย่างความเสียหายต่อบุคคลภายนอก?",o:["ค่าซ่อมรถของผู้เอาประกันภัยเอง","ค่าซ่อมรั้วบ้านที่รถเอาประกันภัยขับชน","การสึกหรอของยางรถ","ค่าเปลี่ยนน้ำมันเครื่อง"],a:"ค่าซ่อมรั้วบ้านที่รถเอาประกันภัยขับชน",e:"รั้วเป็นทรัพย์สินของบุคคลภายนอก ความรับผิดขึ้นกับข้อเท็จจริงและเงื่อนไขกรมธรรม์"},
  {id:27,topic:"ประกันภาคสมัครใจ",q:"คำว่า 'จำนวนเงินเอาประกันภัย' หมายถึงอะไร?",o:["เบี้ยที่ต้องจ่ายทุกเดือน","วงเงินความรับผิดสูงสุดของบริษัทตามที่ระบุและเงื่อนไขกรมธรรม์","ราคาซื้อรถใหม่เสมอ","ค่าปรับเมื่อแจ้งเหตุช้า"],a:"วงเงินความรับผิดสูงสุดของบริษัทตามที่ระบุและเงื่อนไขกรมธรรม์",e:"บริษัทรับผิดไม่เกินวงเงินที่กำหนดสำหรับความคุ้มครองนั้น โดยต้องพิจารณาเงื่อนไขร่วมด้วย"},
  {id:28,topic:"ประกันภาคสมัครใจ",q:"ค่าเสียหายส่วนแรก (Deductible) คืออะไร?",o:["ส่วนลดเบี้ยประกัน","ส่วนของความเสียหายที่ผู้เอาประกันภัยต้องรับผิดชอบเองตามเงื่อนไข","ค่านายหน้าประกันภัย","ค่าซ่อมที่บริษัทจ่ายทั้งหมด"],a:"ส่วนของความเสียหายที่ผู้เอาประกันภัยต้องรับผิดชอบเองตามเงื่อนไข",e:"อาจกำหนดไว้ล่วงหน้าหรือเกิดตามเงื่อนไขของกรมธรรม์ในบางกรณี"},
  {id:29,topic:"ประกันภาคสมัครใจ",q:"หากรถเสียเพราะชิ้นส่วนสึกหรอตามอายุ โดยไม่มีอุบัติเหตุ โดยทั่วไปกรมธรรม์รถยนต์ชดใช้หรือไม่?",o:["ชดใช้ทุกกรณี","โดยทั่วไปไม่ชดใช้ เพราะเป็นการเสื่อมสภาพหรือสึกหรอ","ชดใช้จาก PA","ชดใช้จากประกันตัวผู้ขับขี่"],a:"โดยทั่วไปไม่ชดใช้ เพราะเป็นการเสื่อมสภาพหรือสึกหรอ",e:"กรมธรรม์คุ้มครองภัยที่ระบุ ไม่ใช่การรับประกันการบำรุงรักษาหรือสภาพเครื่องยนต์"},
  {id:30,topic:"หลักกฎหมายประกันภัย",q:"ผู้เอาประกันภัยรู้อยู่แล้วแต่ปกปิดข้อเท็จจริงสำคัญ ซึ่งหากบริษัททราบอาจเรียกเบี้ยสูงขึ้นหรือไม่รับประกัน ผลต่อสัญญาตามประมวลกฎหมายแพ่งและพาณิชย์ มาตรา 865 คือข้อใด?",o:["สัญญาเป็นโมฆียะ","สัญญาเป็นโมฆะทันที","สัญญาสมบูรณ์และแก้ไขไม่ได้","บริษัทต้องเพิ่มทุนประกันอัตโนมัติ"],a:"สัญญาเป็นโมฆียะ",e:"มาตรา 865 ใช้คำว่าโมฆียะ หมายถึงบริษัทยังต้องใช้สิทธิบอกล้างตามกฎหมาย ไม่ใช่ถือว่าสัญญาไม่เคยมีผลโดยอัตโนมัติ"},
  {id:31,topic:"เงื่อนไขกรมธรรม์",q:"เมื่อเกิดอุบัติเหตุ สิ่งใดควรทำเป็นลำดับต้น?",o:["รับสารภาพผิดแทนทุกฝ่ายทันที","ดูแลความปลอดภัย ช่วยผู้บาดเจ็บ และแจ้งบริษัทประกันโดยเร็ว","หลบออกจากที่เกิดเหตุ","ซ่อมรถก่อนถ่ายหลักฐาน"],a:"ดูแลความปลอดภัย ช่วยผู้บาดเจ็บ และแจ้งบริษัทประกันโดยเร็ว",e:"ความปลอดภัยและชีวิตมาก่อน จากนั้นรักษาหลักฐานและแจ้งผู้เกี่ยวข้องโดยเร็ว"},
  {id:32,topic:"เงื่อนไขกรมธรรม์",q:"ผู้เอาประกันภัยควรยอมรับผิดหรือเสนอชดใช้แทนบริษัทเองทันทีหรือไม่?",o:["ควรทุกครั้ง","ไม่ควร ควรแจ้งบริษัทและให้ตรวจสอบข้อเท็จจริงก่อน","ควรเฉพาะเมื่อรถใหม่","ต้องจ่ายเงินสดเสมอ"],a:"ไม่ควร ควรแจ้งบริษัทและให้ตรวจสอบข้อเท็จจริงก่อน",e:"การยอมรับผิดหรือทำข้อตกลงเองอาจกระทบการจัดการสินไหม ควรประสานบริษัทก่อน"},
  {id:33,topic:"เงื่อนไขกรมธรรม์",q:"หลักฐานใดมีประโยชน์เมื่อเกิดอุบัติเหตุ?",o:["ภาพสถานที่ ความเสียหาย ทะเบียนรถ และข้อมูลคู่กรณี","เฉพาะรูปผู้ขับขี่รถเรา","เฉพาะใบเสร็จค่าน้ำมัน","ไม่ต้องเก็บหลักฐาน"],a:"ภาพสถานที่ ความเสียหาย ทะเบียนรถ และข้อมูลคู่กรณี",e:"หลักฐานที่ครบช่วยให้ตรวจสอบเหตุและพิจารณาความรับผิดได้รวดเร็วขึ้น"},
  {id:34,topic:"เงื่อนไขกรมธรรม์",q:"หากต้องการเปลี่ยนชื่อผู้ขับขี่ที่ระบุในกรมธรรม์รถยนต์ วิธีที่ถูกต้องคือข้อใด?",o:["แจ้งบริษัทและให้บริษัทออกเอกสารแนบท้ายแก้ไข","ขีดแก้ชื่อในกรมธรรม์ด้วยตนเอง","แจ้งคู่กรณีหลังเกิดเหตุเท่านั้น","ไม่ต้องดำเนินการใด"],a:"แจ้งบริษัทและให้บริษัทออกเอกสารแนบท้ายแก้ไข",e:"ข้อมูลในสัญญาต้องแก้โดยความเห็นชอบของบริษัทและมีหลักฐานเป็นเอกสารแนบท้าย ผู้เอาประกันภัยไม่ควรแก้กรมธรรม์เอง"},
  {id:35,topic:"เงื่อนไขกรมธรรม์",q:"การใช้รถแข่งขันความเร็วโดยไม่ได้ซื้อความคุ้มครองเฉพาะ โดยทั่วไปเป็นอย่างไร?",o:["คุ้มครองเหมือนใช้ส่วนบุคคล","มักเป็นข้อยกเว้นของกรมธรรม์มาตรฐาน","คุ้มครองจาก PA เสมอ","เพิ่มทุนประกันอัตโนมัติ"],a:"มักเป็นข้อยกเว้นของกรมธรรม์มาตรฐาน",e:"การใช้แข่งขันมีความเสี่ยงผิดจากการใช้ปกติและมักถูกยกเว้น เว้นแต่มีข้อตกลงเฉพาะ"},
  {id:36,topic:"เงื่อนไขกรมธรรม์",q:"เมื่อตรวจสิทธิสินไหมรถยนต์ เหตุใดจึงต้องแยกความคุ้มครองรถเอาประกันภัยออกจากความรับผิดต่อบุคคลภายนอก?",o:["เพราะข้อยกเว้นและผลทางสิทธิของแต่ละหมวดอาจต่างกัน","เพราะใช้เลขกรมธรรม์คนละฉบับเสมอ","เพราะ พ.ร.บ. จ่ายค่าซ่อมรถแทนทั้งหมด","เพราะบุคคลภายนอกไม่มีสิทธิเรียกร้อง"],a:"เพราะข้อยกเว้นและผลทางสิทธิของแต่ละหมวดอาจต่างกัน",e:"ห้ามสรุปว่าการผิดเงื่อนไขเรื่องผู้ขับขี่ทำให้ทุกหมวดสิ้นสิทธิพร้อมกัน ต้องอ่านข้อยกเว้นของความคุ้มครองแต่ละส่วน"},
  {id:37,topic:"เงื่อนไขกรมธรรม์",q:"เมื่อเกิดเหตุจากผู้ขับขี่เมาสุรา การพิจารณาสินไหมที่ถูกต้องควรทำอย่างไร?",o:["แยกตรวจความคุ้มครองรถเอาประกันภัย สิทธิบุคคลภายนอก และสิทธิเรียกคืนตามเงื่อนไข","ปฏิเสธผู้เสียหายทุกคนทันที","จ่ายค่าซ่อมรถทุกส่วนโดยไม่ตรวจเงื่อนไข","ถือว่า พ.ร.บ. ถูกยกเลิกย้อนหลัง"],a:"แยกตรวจความคุ้มครองรถเอาประกันภัย สิทธิบุคคลภายนอก และสิทธิเรียกคืนตามเงื่อนไข",e:"ผลของข้อยกเว้นเมาสุราไม่ควรถูกตอบแบบเหมารวม เพราะความคุ้มครองตัวรถ สิทธิของบุคคลภายนอก และสิทธิเรียกคืนอาจต่างกัน"},
  {id:38,topic:"หลักกฎหมายประกันภัย",q:"สิทธิบอกล้างสัญญาจากการปกปิดข้อเท็จจริงตามมาตรา 865 ระงับเมื่อพ้นกำหนดใด?",o:["หนึ่งเดือนนับแต่บริษัททราบมูลเหตุ หรือห้าปีนับแต่ทำสัญญา","เจ็ดวันนับแต่ทำสัญญาเท่านั้น","สิบปีนับแต่เกิดเหตุเท่านั้น","ไม่มีอายุการใช้สิทธิ"],a:"หนึ่งเดือนนับแต่บริษัททราบมูลเหตุ หรือห้าปีนับแต่ทำสัญญา",e:"มาตรา 865 กำหนดกรอบเวลาสองชั้น บริษัทต้องใช้สิทธิภายในหนึ่งเดือนนับแต่ทราบมูลเหตุ และไม่เกินห้าปีนับแต่วันทำสัญญา"},
  {id:39,topic:"เงื่อนไขกรมธรรม์",q:"เมื่อต้องการเปลี่ยนชื่อผู้เอาประกันภัยหลังโอนขายรถ ข้อใดปลอดภัยและถูกต้องที่สุด?",o:["แจ้งบริษัทและให้ดำเนินการแก้ไขหรือรับรองตามเงื่อนไขกรมธรรม์","ผู้ซื้อขีดแก้ชื่อเอง","ใช้ชื่อเดิมต่อไปโดยไม่แจ้งจนหมดอายุ","ลบเลขตัวถังออกจากเอกสาร"],a:"แจ้งบริษัทและให้ดำเนินการแก้ไขหรือรับรองตามเงื่อนไขกรมธรรม์",e:"การโอนรถไม่ใช่เหตุให้ผู้ซื้อแก้สัญญาเอง ต้องแจ้งบริษัทเพื่อตรวจสิทธิและออกหลักฐานการเปลี่ยนแปลงให้ถูกต้อง"},
  {id:40,topic:"เงื่อนไขกรมธรรม์",q:"หลักสุจริตอย่างยิ่งในการประกันภัยกำหนดให้ผู้ขอเอาประกันภัยทำสิ่งใด?",o:["ปกปิดเหตุที่ทำให้เบี้ยสูงขึ้น","เปิดเผยข้อเท็จจริงอันเป็นสาระสำคัญต่อการรับประกันภัย","เลือกเปิดเผยเฉพาะหลังเกิดเหตุ","ให้ตัวแทนเดาข้อมูลแทน"],a:"เปิดเผยข้อเท็จจริงอันเป็นสาระสำคัญต่อการรับประกันภัย",e:"ข้อมูลสำคัญช่วยให้บริษัทประเมินว่าจะรับเสี่ยงและกำหนดเงื่อนไขหรือเบี้ยอย่างไร"},

  {id:41,topic:"ความคุ้มครองเสริม",q:"PA ในเอกสารแนบท้ายกรมธรรม์รถยนต์หมายถึงอะไร?",o:["ความคุ้มครองอุบัติเหตุส่วนบุคคล","ค่าซ่อมทรัพย์สิน","ค่าเสียหายส่วนแรก","ประกันรถหาย"],a:"ความคุ้มครองอุบัติเหตุส่วนบุคคล",e:"PA คุ้มครองผู้ขับขี่และ/หรือผู้โดยสารตามจำนวนคน วงเงิน และเงื่อนไขที่ระบุ"},
  {id:42,topic:"ความคุ้มครองเสริม",q:"ความคุ้มครองค่ารักษาพยาบาลในเอกสารแนบท้าย จ่ายอย่างไรโดยหลัก?",o:["จ่ายค่าซ่อมรถแทน","จ่ายค่ารักษาจากอุบัติเหตุตามจริงภายในวงเงินและเงื่อนไข","จ่ายเบี้ยคืนทุกปี","จ่ายเฉพาะบุคคลภายนอกเสมอ"],a:"จ่ายค่ารักษาจากอุบัติเหตุตามจริงภายในวงเงินและเงื่อนไข",e:"ต้องดูผู้ได้รับความคุ้มครอง จำนวนที่นั่ง และวงเงินที่ระบุในตารางกรมธรรม์"},
  {id:43,topic:"ความคุ้มครองเสริม",q:"การประกันตัวผู้ขับขี่มีวัตถุประสงค์ใด?",o:["จ่ายค่าปรับจราจรทุกชนิด","จัดหลักประกันตัวในคดีอาญาอันเนื่องจากอุบัติเหตุรถตามเงื่อนไข","ซื้อรถใหม่ให้ผู้ขับขี่","จ่ายค่าเสียเวลาไปทำงาน"],a:"จัดหลักประกันตัวในคดีอาญาอันเนื่องจากอุบัติเหตุรถตามเงื่อนไข",e:"เป็นวงเงินหลักประกัน ไม่ใช่การรับผิดแทนผู้ขับขี่สำหรับโทษหรือค่าปรับทุกอย่าง"},
  {id:44,topic:"ความคุ้มครองเสริม",q:"วงเงิน PA ค่ารักษาพยาบาล และประกันตัวผู้ขับขี่ดูได้จากที่ใด?",o:["ป้ายทะเบียนรถ","ตารางกรมธรรม์และเอกสารแนบท้าย","ใบขับขี่","คู่มือรถเท่านั้น"],a:"ตารางกรมธรรม์และเอกสารแนบท้าย",e:"วงเงินไม่ได้เท่ากันทุกกรมธรรม์ ต้องยึดเอกสารที่ออกให้ผู้เอาประกันภัย"},
  {id:45,topic:"หลักประกันภัย",q:"หลักการชดใช้ค่าสินไหมทดแทนมีเป้าหมายสำคัญอย่างไร?",o:["ทำให้ผู้เอาประกันภัยมีกำไรจากเหตุ","ทำให้กลับสู่ฐานะใกล้เคียงก่อนเกิดความเสียหาย โดยไม่เกินความเสียหายและวงเงิน","จ่ายสองเท่าของทุนประกันเสมอ","ลงโทษบุคคลภายนอก"],a:"ทำให้กลับสู่ฐานะใกล้เคียงก่อนเกิดความเสียหาย โดยไม่เกินความเสียหายและวงเงิน",e:"ประกันวินาศภัยโดยหลักมุ่งชดใช้ความเสียหายจริง ไม่เปิดช่องให้แสวงหากำไรจากภัย"},
  {id:46,topic:"หลักประกันภัย",q:"ส่วนได้เสียที่อาจเอาประกันภัยหมายถึงอะไร?",o:["ความอยากได้รถคันหนึ่ง","ความสัมพันธ์ทางกฎหมายหรือเศรษฐกิจที่ทำให้ได้รับความเสียหายเมื่อภัยเกิด","ส่วนลดจากนายหน้า","ค่าธรรมเนียมต่อทะเบียน"],a:"ความสัมพันธ์ทางกฎหมายหรือเศรษฐกิจที่ทำให้ได้รับความเสียหายเมื่อภัยเกิด",e:"ผู้เอาประกันภัยต้องมีส่วนได้เสียต่อวัตถุที่เอาประกันภัยตามหลักกฎหมาย"},
  {id:47,topic:"หลักประกันภัย",q:"เมื่อบริษัทชดใช้ค่าสินไหมแล้วเข้ารับสิทธิเรียกร้องจากผู้ก่อความเสียหาย เรียกหลักการใด?",o:["การรับช่วงสิทธิ","การเฉลี่ย","การปกปิดข้อเท็จจริง","การเวนคืน"],a:"การรับช่วงสิทธิ",e:"บริษัทเข้ารับช่วงสิทธิได้เท่าที่ได้ชดใช้ ภายใต้หลักเกณฑ์ของกฎหมาย"},
  {id:48,topic:"หลักประกันภัย",q:"หากทรัพย์เดียวกันทำประกันภัยความเสี่ยงเดียวกันไว้หลายบริษัท หลักใดช่วยแบ่งภาระระหว่างบริษัท?",o:["หลักเฉลี่ยหรือการร่วมชดใช้","หลักประกันตัว","หลักค่าเสียหายรายวัน","หลักภาคบังคับ"],a:"หลักเฉลี่ยหรือการร่วมชดใช้",e:"ผู้เอาประกันภัยไม่ควรได้รับเกินความเสียหายจริง บริษัทที่รับประกันอาจร่วมรับผิดตามสัดส่วน"},
  {id:49,topic:"จรรยาบรรณนายหน้า",q:"เมื่อลูกค้าต้องการซื้อประกัน นายหน้าควรปฏิบัติอย่างไร?",o:["เสนอเฉพาะแบบที่ได้ค่าตอบแทนสูงโดยไม่อธิบาย","สอบถามความต้องการ อธิบายความคุ้มครอง ข้อยกเว้น และเงื่อนไขอย่างถูกต้อง","รับรองว่าทุกเคลมจ่ายแน่นอน","กรอกข้อมูลเท็จเพื่อให้เบี้ยถูก"],a:"สอบถามความต้องการ อธิบายความคุ้มครอง ข้อยกเว้น และเงื่อนไขอย่างถูกต้อง",e:"การเสนอขายต้องเหมาะสม โปร่งใส ไม่ทำให้ลูกค้าเข้าใจผิด และให้ข้อมูลที่จำเป็นต่อการตัดสินใจ"},
  {id:50,topic:"จรรยาบรรณนายหน้า",q:"นายหน้าควรจัดการข้อมูลส่วนบุคคลของลูกค้าอย่างไร?",o:["ส่งต่อให้ทุกคนในทีมโดยไม่จำกัด","ใช้เท่าที่จำเป็นตามวัตถุประสงค์ รักษาความปลอดภัย และไม่เปิดเผยโดยไม่มีฐานที่ชอบ","โพสต์เอกสารลูกค้าในสื่อสาธารณะ","เก็บสำเนาบัตรไว้ในโทรศัพท์ส่วนตัวโดยไม่มีมาตรการ"],a:"ใช้เท่าที่จำเป็นตามวัตถุประสงค์ รักษาความปลอดภัย และไม่เปิดเผยโดยไม่มีฐานที่ชอบ",e:"งานประกันมีข้อมูลระบุตัวบุคคลจำนวนมาก นายหน้าต้องรักษาความลับและปฏิบัติตามกฎหมายคุ้มครองข้อมูล"}
];

const EXAM_SIZE = 20;
const storageKey = "mittareExamCoachStateV1";
const views = ["home-view", "topics", "leaderboard-section", "exam-view", "result-view", "flashcard-view"];
let examQuestions = [];
let currentQuestionIndex = 0;
let responses = {};
let flaggedQuestions = new Set();
let timerInterval;
let elapsedSeconds = 0;
let flashcards = [];
let flashcardIndex = 0;
let currentSelectedTopic = "";
let pendingExamStart = false;

const $ = (id) => document.getElementById(id);
const shuffle = (items) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

function getState() {
  try {
    return {...{attempts:0, answered:0, best:0, recentIds:[], theme:"light", user:null}, ...JSON.parse(localStorage.getItem(storageKey) || "{}")};
  } catch {
    return {attempts:0, answered:0, best:0, recentIds:[], theme:"light", user:null};
  }
}

function saveState(nextState) {
  localStorage.setItem(storageKey, JSON.stringify({...getState(), ...nextState}));
}

function updateDashboard() {
  const state = getState();
  $("best-score").textContent = state.attempts ? `${state.best}%` : "—";
  $("attempt-count").textContent = `${state.attempts} รอบ`;
  $("answered-count").textContent = `${state.answered} ข้อ`;
  $("best-score-ring").style.setProperty("--score", `${state.best}%`);
  $("current-user-name").textContent = state.user?.displayName || "ลงชื่อเข้าใช้";
}

function showView(name) {
  const homeSections = new Set(["home-view", "topics", "leaderboard-section"]);
  views.forEach((id) => $(id).hidden = name === "home-view" ? !homeSections.has(id) : id !== name);
  window.scrollTo({top:0, behavior:"smooth"});
}

async function fetchQuestions(limit, excludedIds = [], topic = "") {
  const query = new URLSearchParams({limit:String(limit)});
  if (excludedIds.length) query.set("exclude", excludedIds.join(","));
  if (topic) query.set("topic", topic);
  try {
    const response = await fetch(`/api/questions?${query}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn("ใช้คลังสำรองในเบราว์เซอร์ เนื่องจากเชื่อมต่อ API ไม่สำเร็จ", error);
    const recent = new Set(excludedIds);
    const pool = topic ? questionBank.filter((item) => item.topic === topic) : questionBank;
    const ordered = [...shuffle(pool.filter((item) => !recent.has(item.id))), ...shuffle(pool.filter((item) => recent.has(item.id)))];
    return limit === "all" ? ordered : ordered.slice(0, Number(limit));
  }
}

async function buildExamSet() {
  const questions = await fetchQuestions(EXAM_SIZE, getState().recentIds || [], currentSelectedTopic);
  return questions.map((item) => ({...item, displayOptions:shuffle(item.o)}));
}

async function startExam() {
  if (!getState().user?.token) {
    pendingExamStart = true;
    $("user-dialog").showModal();
    return;
  }
  currentSelectedTopic = $("exam-topic").value;
  const startButton = $("start-exam");
  startButton.disabled = true;
  startButton.textContent = "กำลังสุ่มข้อสอบ...";
  examQuestions = await buildExamSet();
  startButton.disabled = false;
  startButton.textContent = "เริ่มทำข้อสอบ";
  currentQuestionIndex = 0;
  responses = {};
  flaggedQuestions = new Set();
  elapsedSeconds = 0;
  showView("exam-view");
  createQuestionNavigation();
  renderQuestion();
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    elapsedSeconds += 1;
    $("timer").textContent = `${String(Math.floor(elapsedSeconds / 60)).padStart(2,"0")}:${String(elapsedSeconds % 60).padStart(2,"0")}`;
  }, 1000);
}

function createQuestionNavigation() {
  $("question-dots").replaceChildren(...examQuestions.map((_, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "question-dot";
    button.textContent = index + 1;
    button.setAttribute("aria-label", `ไปข้อ ${index + 1}`);
    button.addEventListener("click", () => {currentQuestionIndex = index; renderQuestion();});
    return button;
  }));
}

function renderQuestion() {
  const question = examQuestions[currentQuestionIndex];
  $("question-counter").textContent = `ข้อ ${currentQuestionIndex + 1}/${examQuestions.length}`;
  $("answered-progress").textContent = `ตอบแล้ว ${Object.keys(responses).length} ข้อ`;
  $("progress-bar").style.width = `${((currentQuestionIndex + 1) / examQuestions.length) * 100}%`;
  $("question-topic").textContent = `หมวด: ${question.topic}`;
  $("question-text").textContent = question.q;
  $("question-text").focus({preventScroll:true});
  const flagged = flaggedQuestions.has(question.id);
  $("flag-question").setAttribute("aria-pressed", String(flagged));
  $("flag-question").textContent = flagged ? "★ ทำเครื่องหมายแล้ว" : "☆ ทำเครื่องหมาย";
  const fieldset = $("answer-options");
  fieldset.querySelectorAll(".answer-option").forEach((node) => node.remove());
  question.displayOptions.forEach((option, index) => {
    const label = document.createElement("label");
    label.className = "answer-option";
    const input = document.createElement("input");
    input.type = "radio";
    input.name = `question-${question.id}`;
    input.value = option;
    input.checked = responses[question.id] === option;
    input.addEventListener("change", () => {responses[question.id] = option; updateQuestionNavigation();});
    const letter = document.createElement("span");
    letter.className = "option-letter";
    letter.textContent = String.fromCharCode(65 + index);
    const text = document.createElement("span");
    text.textContent = option;
    label.append(input, letter, text);
    fieldset.append(label);
  });
  $("previous-question").disabled = currentQuestionIndex === 0;
  $("next-question").textContent = currentQuestionIndex === examQuestions.length - 1 ? "ตรวจและส่งคำตอบ" : "ข้อต่อไป";
  updateQuestionNavigation();
}

function updateQuestionNavigation() {
  [...$("question-dots").children].forEach((button, index) => {
    const question = examQuestions[index];
    button.classList.toggle("current", index === currentQuestionIndex);
    button.classList.toggle("answered", Boolean(responses[question.id]));
    button.classList.toggle("flagged", flaggedQuestions.has(question.id));
  });
  $("answered-progress").textContent = `ตอบแล้ว ${Object.keys(responses).length} ข้อ`;
}

function requestSubmission() {
  const unanswered = examQuestions.length - Object.keys(responses).length;
  $("confirm-message").textContent = unanswered ? `ยังไม่ได้ตอบ ${unanswered} ข้อ ระบบจะนับข้อที่เว้นไว้เป็นตอบผิด` : "คุณตอบครบทุกข้อแล้ว ต้องการดูคะแนนและเฉลยหรือไม่?";
  $("confirm-dialog").showModal();
}

function submitExam() {
  clearInterval(timerInterval);
  const score = examQuestions.filter((item) => responses[item.id] === item.a).length;
  const percentage = Math.round((score / examQuestions.length) * 100);
  const state = getState();
  saveState({attempts:state.attempts + 1, answered:state.answered + examQuestions.length, best:Math.max(state.best, percentage), recentIds:examQuestions.map((item) => item.id)});
  $("result-score").textContent = score;
  $("result-total").textContent = `/ ${examQuestions.length} ข้อ`;
  $("result-title").textContent = percentage >= 80 ? "ยอดเยี่ยม จำได้แม่นมาก!" : percentage >= 60 ? "ผ่านเกณฑ์ฝึกซ้อมแล้ว" : "ทบทวนอีกนิด แล้วลองใหม่";
  $("result-message").textContent = `ได้ ${percentage}% • ใช้เวลา ${Math.floor(elapsedSeconds / 60)} นาที ${elapsedSeconds % 60} วินาที`;
  renderReview("all");
  showView("result-view");
  updateDashboard();
  saveAttemptToServer(score);
}

async function saveAttemptToServer(score) {
  const user = getState().user;
  if (!user?.token) return;
  const topicScores = {};
  examQuestions.forEach((item) => {
    topicScores[item.topic] ||= {correct:0,total:0};
    topicScores[item.topic].total += 1;
    if (responses[item.id] === item.a) topicScores[item.topic].correct += 1;
  });
  try {
    await fetch("/api/attempts", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:user.token,score,totalQuestions:examQuestions.length,durationSeconds:elapsedSeconds,selectedTopic:currentSelectedTopic || "ทุกหมวด",topicScores})});
    loadLeaderboard();
  } catch (error) { console.warn("บันทึกผลส่วนกลางไม่สำเร็จ", error); }
}

function renderReview(filter) {
  const items = examQuestions.filter((item) => filter === "all" || responses[item.id] !== item.a);
  const nodes = items.map((item, index) => {
    const correct = responses[item.id] === item.a;
    const article = document.createElement("article");
    article.className = `review-item${correct ? "" : " wrong"}`;
    const status = document.createElement("span");
    status.className = "eyebrow";
    status.textContent = correct ? "✓ ตอบถูก" : "✕ ตอบผิด";
    const title = document.createElement("h3");
    title.textContent = `${index + 1}. ${item.q}`;
    const answer = document.createElement("div");
    answer.className = "review-answer";
    const yourAnswer = responses[item.id] || "ไม่ได้ตอบ";
    answer.innerHTML = `<div class="${correct ? "" : "your-wrong"}">คำตอบของคุณ: ${escapeHtml(yourAnswer)}</div><div><strong>คำตอบที่ถูก: ${escapeHtml(item.a)}</strong></div>`;
    const explanation = document.createElement("div");
    explanation.className = "explanation";
    explanation.textContent = `จำไว้: ${item.e}`;
    article.append(status, title, answer, explanation);
    return article;
  });
  $("review-list").replaceChildren(...nodes);
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

async function startFlashcards() {
  flashcards = shuffle(await fetchQuestions("all"));
  flashcardIndex = 0;
  showView("flashcard-view");
  renderFlashcard();
}

function renderFlashcard() {
  const card = flashcards[flashcardIndex];
  $("flashcard").classList.remove("flipped");
  $("flashcard-counter").textContent = `${flashcardIndex + 1} / ${flashcards.length}`;
  $("flashcard-topic").textContent = card.topic;
  $("flashcard-question").textContent = card.q;
  $("flashcard-answer").textContent = `${card.a} — ${card.e}`;
  $("previous-card").disabled = flashcardIndex === 0;
}

function goHome() {
  clearInterval(timerInterval);
  showView("home-view");
  updateDashboard();
  loadLeaderboard();
}

async function loadTopics() {
  try {
    const response = await fetch("/api/topics");
    const topics = await response.json();
    const select = $("exam-topic");
    topics.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.topic;
      option.textContent = `${item.topic} (${item.questionCount} ข้อ)`;
      select.append(option);
    });
  } catch (error) { console.warn("โหลดหมวดข้อสอบไม่สำเร็จ", error); }
}

async function loadLeaderboard() {
  try {
    const response = await fetch("/api/leaderboard");
    const leaders = await response.json();
    if (!leaders.length) return;
    $("leaderboard-list").replaceChildren(...leaders.map((leader, index) => {
      const item = document.createElement("li");
      const rank = document.createElement("span");
      rank.className = "leader-rank";
      rank.textContent = index < 3 ? ["🥇","🥈","🥉"][index] : String(index + 1);
      const name = document.createElement("span");
      name.className = "leader-name";
      name.textContent = leader.display_name;
      const detail = document.createElement("small");
      detail.textContent = `${leader.attempts} รอบ • เฉลี่ย ${leader.average_score}%`;
      name.append(detail);
      const score = document.createElement("strong");
      score.textContent = `${leader.best_score}%`;
      item.append(rank, name, score);
      return item;
    }));
  } catch (error) { console.warn("โหลดอันดับทีมไม่สำเร็จ", error); }
}

async function registerUser(event) {
  event.preventDefault();
  const displayName = $("display-name").value.trim();
  $("user-form-error").textContent = "";
  try {
    const response = await fetch("/api/users", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({displayName})});
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "ลงชื่อไม่สำเร็จ");
    saveState({user:result});
    updateDashboard();
    $("user-dialog").close();
    if (pendingExamStart) { pendingExamStart = false; startExam(); }
  } catch (error) { $("user-form-error").textContent = error.message; }
}

$("start-exam").addEventListener("click", startExam);
$("retry-exam").addEventListener("click", startExam);
$("start-flashcards").addEventListener("click", startFlashcards);
$("exit-exam").addEventListener("click", goHome);
$("back-home").addEventListener("click", goHome);
$("exit-flashcards").addEventListener("click", goHome);
$("brand-home").addEventListener("click", (event) => {event.preventDefault(); goHome();});
$("user-menu").addEventListener("click", () => {$("display-name").value = ""; $("user-form-error").textContent = ""; $("user-dialog").showModal();});
$("close-user-dialog").addEventListener("click", () => {pendingExamStart = false; $("user-dialog").close();});
$("user-form").addEventListener("submit", registerUser);
$("previous-question").addEventListener("click", () => {currentQuestionIndex -= 1; renderQuestion();});
$("next-question").addEventListener("click", () => {
  if (currentQuestionIndex < examQuestions.length - 1) {currentQuestionIndex += 1; renderQuestion();} else {requestSubmission();}
});
$("submit-exam").addEventListener("click", requestSubmission);
$("confirm-dialog").addEventListener("close", (event) => {if (event.target.returnValue === "confirm") submitExam();});
$("flag-question").addEventListener("click", () => {
  const id = examQuestions[currentQuestionIndex].id;
  flaggedQuestions.has(id) ? flaggedQuestions.delete(id) : flaggedQuestions.add(id);
  renderQuestion();
});
$("flashcard").addEventListener("click", () => $("flashcard").classList.toggle("flipped"));
$("previous-card").addEventListener("click", () => {if (flashcardIndex > 0) {flashcardIndex -= 1; renderFlashcard();}});
$("next-card").addEventListener("click", () => {flashcardIndex = (flashcardIndex + 1) % flashcards.length; renderFlashcard();});
document.querySelectorAll(".filter-button").forEach((button) => button.addEventListener("click", () => {
  document.querySelectorAll(".filter-button").forEach((item) => item.classList.toggle("active", item === button));
  renderReview(button.dataset.filter);
}));
$("theme-toggle").addEventListener("click", () => {
  const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = theme;
  $("theme-toggle").textContent = theme === "dark" ? "☀" : "☾";
  saveState({theme});
});

const initialState = getState();
document.documentElement.dataset.theme = initialState.theme;
$("theme-toggle").textContent = initialState.theme === "dark" ? "☀" : "☾";
updateDashboard();
loadTopics();
loadLeaderboard();
fetch("/api/meta").then((response) => response.json()).then((meta) => {
  $("question-bank-count").textContent = meta.totalQuestions;
}).catch(() => {});
