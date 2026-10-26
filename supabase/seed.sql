-- สร้างจาก Firebase export โดย supabase/firebase-to-supabase.mjs (ไม่มีโหนด users)
-- รันใน SQL Editor หลังจากรัน schema.sql แล้ว
begin;
insert into public.nodes (path, value) values ('announcements/1787274737085', '{"author":"Admin_Summer","content":"TEST","createdAt":1787274737085,"title":"TEST"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('announcements/1787276695027', '{"author":"Admin_Summer","content":"มาร์ก ซักเคอร์เบิร์ก ได้เริ่มเขียนเว็บไซต์ เฟซแมช ขึ้นมาก่อนที่จะเป็นเฟซบุ๊ก เมื่อวันที่ 28 ตุลาคม ค.ศ. 2003 ขณะที่กำลังศึกษาอยู่ชั้นปีที่ 2 ของมหาวิทยาลัยฮาวาร์ด โดยเป็นเว็บไซต์ที่เปรียบเสมือนเว็บ ฮอตออร์น็อต ของมหาวิทยาลัยฮาวาร์ด[16] และจากข้อมูลของหนังสือพิมพ์มหาวิทยาลัยที่ชื่อ The Harvard Crimson เฟซแมชใช้ภาพที่ได้จาก เฟซบุ๊ก หนังสือแจกสำหรับนักศึกษามหาวิทยาลัยที่มีรูปนักศึกษา จากบ้าน 9 หลัง โดยจะมีรูป 2 รูปให้คนเลือกว่า ใครร้อนแรงกว่ากัน[17]\n\n\nมาร์ก ซักเคอร์เบิร์ก ผู้ก่อตั้งเฟซบุ๊ก\nเพื่อทำให้ได้สำเร็จ ซักเคอร์เบิร์กได้แฮกเข้าไปในเครือข่ายคอมพิวเตอร์ของฮาวาร์ดในพื้นที่ป้องกัน และได้คัดลอกภาพส่วนตัวประจำหอพัก ซึ่งในขณะนั้นฮาวาร์ดยังไม่มีสารบัญรูปภาพและข้อมูลพื้นฐานของนักศึกษา และเฟซแมชได้ทำให้มีผู้เข้าเยี่ยมชม 450 คน และดูรูปภาพ 22,000 ครั้งใน 4 ชั่วโมงแรกที่ออนไลน์[17] และเว็บไซต์นี้ได้จำลองสังคมกายภาพของคน ด้วยอัตลักษณ์จริง เป็นตัวแทนของกุญแจสำคัญด้านมุมมอง ที่ต่อมาได้กลายมาเป็น เฟซบุ๊ก[18]\n\nเว็บไซต์ได้ก้าวไกลไปในหลายเซิร์ฟเวอร์ของกลุ่มในมหาวิทยาลัย แต่ก็ปิดตัวไปในอีกไม่กี่วันโดยคณะบริหารฮาวาร์ด ซักเคอร์เบิร์กถูกกล่าวโทษว่าทำผิดต่อระบบรักษาความปลอดภัย การละเมิดลิขสิทธิ์ และการละเมิดความเป็นส่วนตัว และยังถูกไล่ออก แต่ท้ายที่สุดแล้วข้อกล่าวหาก็ยกเลิกไป[19] ต่อมาซักเคอร์เบิร์กได้ขยับขยายโครงการในเทอมนั้นเอง โดยได้คิดค้นเครื่องมือการศึกษาทางสังคมที่ก้าวหน้า ของการสอบวิชาประวัติศาสตร์ โดยการอัปโหลดรูปเกี่ยวกับประวัติศาสตร์โรม 500 รูป โดยมี 1 รูปกับอีก 1 ส่วนที่ให้แสดงความเห็น[18] เขาเปิดกับเพื่อนร่วมชั้นของเขา และคนเริ่มที่จะแบ่งปันข้อความกัน\n\nในเทอมต่อมาซักเคอร์เบิร์กเริ่มเขียนโค้ดในเว็บไซต์ใหม่ในเดือนมกราคม ค.ศ. 2004 เขาได้รับแรงกระตุ้นให้ทำ เขาพูดไว้ใน The Harvard Crimson เกี่ยวกับเรื่อง เฟซแมช[20] และเมื่อวันที่ 4 กุมภาพันธ์ ค.ศ. 2004 ซักเกอร์เบิร์กได้เปิดตัวเว็บไซต์ \"เดอะเฟซบุก\" ในยูอาร์แอล thefacebook.com[21]\n\n6 วันหลังจากเปิดเว็บไซต์ รุ่นพี่ 3 คน คือ แคเมรอน วิงก์เลวอส, ไทเลอร์ วิงก์เลวอส และดิฟยา นาเรนดรา ได้ฟ้องร้องซักเกอร์เบิร์กที่หลอกลวงพวกเขาให้เชื่อว่า เขาได้ช่วยที่จะช่วยสร้างเครือข่ายสังคมที่ชื่อว่า HarvardConnection.com ขณะที่เขาใช้แนวคิดพวกเขาในการสร้างเว็บไซต์เพื่อแข่งขัน[22] ทั้ง 3 คนได้บ่นในหนังสือพิมพ์ Harvard Crimson โดยทางหนังสือพิมพ์เริ่มทำการสอบสวน ต่อมาทั้ง 3 คนได้ยื่นฟ้องทางกฎหมายต่อซักเกอร์เบิร์กในภายหลัง[23]\n\nแต่เดิม สมาชิกจะจำกัดเฉพาะนักศึกษาของมหาวิทยาลัยฮาวาร์ด และภายในเดือนแรก มากกว่าครึ่งหนึ่งของนักศึกษาที่กำลังศึกษาอยู่ได้ลงทะเบียนใช้บริการ[24] เอ็ดวาร์โด ซาเวริน (ดูแลเรื่องธุรกิจ), ดิสติน มอสโควิตซ์ (โปรแกรเมอร์), แอนดรูว์ แม็กคอลลัม (กราฟิก) และคริส ฮิวส์ ที่ต่อมาได้ร่วมกับซักเกอร์เบิร์กเพื่อประชาสัมพันธ์เว็บไซต์ และในเดือนมีนาคม ค.ศ. 2004 เฟซบุ๊กได้ขยับขยายสู่มหาวิทยาลัยอื่นอย่าง สแตนฟอร์ด, โคลัมเบีย, และเยล[25] และยังคงขยับขยายต่อสู่กลุ่มไอวีลีกทั้งหมด และมหาวิทยาลัยบอสตัน, มหาวิทยาลัยนิวยอร์ก, เอ็มไอที และสู่มหาวิทยาลัยอื่นในแคนาดาและสหรัฐอเมริกาไปทีละน้อย[26][27]\n\nเฟซบุ๊กได้เป็นบริษัทในฤดูร้อนปี ค.ศ. 2004 และได้นักธุรกิจ ฌอน พาร์กเกอร์ ที่ได้เคยแนะนำซักเกอร์เบิร์กอย่างเป็นกันเอง ก็ได้ก้าวมาเป็นประธานของบริษัท.[28] ในเดือนมิถุนายน ค.ศ. 2004 เฟซบุ๊กได้ย้ายฐานปฏิบัติงานมาอยู่ที่ แพโลอัลโต รัฐแคลิฟอร์เนีย[25] และได้รับเงินทุนในเดือนนั้นจากผู้ร่วมก่อตั้ง เพย์พาล ที่ชื่อ ปีเตอร์ ธีล[29] บริษัทได้เปลี่ยนชื่อ โดยลดคำว่า เดอะ ออกไป และซื้อโดเมนเนมใหม่ในชื่อ เฟซบุ๊ก.คอม ในปี ค.ศ. 2005 ด้วยเงิน 2 แสนดอลลาร์สหรัฐ[30]\n\nเฟซบุ๊กได้เปิดตัวในรูปแบบของโรงเรียนไฮสคูล ในเดือนกันยายน ค.ศ. 2005 ที่ซักเกอร์เบิร์กเรียกว่า ก้าวต่อไปที่มีเหตุผล[31] ณ เวลานั้นในเครือข่ายไฮสคูล ต้องการการรับเชิญเท่านั้นเพื่อร่วมเว็บไซต์[32] ต่อมาเฟซบุ๊กได้ขยับขยายให้กับลูกจ้างบริษัทที่คัดสรรอย่าง แอปเปิล และ ไมโครซอฟท์[33] เฟซบุ๊กได้เปิดตัวเมื่อวันที่ 26 กันยายน ค.ศ. 2006 ให้ทุกคนได้ใช้กัน โดยต้องมีอายุมากกว่า 13 ปี และมีอีเมลที่แท้จริง[34][35]\n\nในวันที่ 24 ตุลาคม ค.ศ. 2007 ไมโครซอฟท์ประกาศว่าได้ซื้อหุ้นของเฟซบุ๊กเป็นจำนวน 1.6% ด้วยเงิน 240 ล้านดอลลาร์สหรัฐ ทำให้เฟซบุกมีมูลค่าราว 15 พันล้านดอลลาร์สหรัฐ[36] และทำให้ไมโครซอฟท์มีสิทธิ์ที่จะแขวนป้ายโฆษณาบนเฟซบุ๊กได้[37] ในเดือนตุลาคม ค.ศ. 2008 เฟซบุกประกาศว่าจะตั้งสำนักงานใหญ่ระดับนานาชาติในดับลิน ประเทศไอร์แลนด์[38]\n\nในเดือนกันยายน ค.ศ. 2009 เฟซบุ๊กได้กล่าวว่า สถานะการเงินเริ่มเป็นตัวเลขบวกเป็นครั้งแรก [39] ในเดือนพฤศจิกายน ค.ศ. 2010 จากข้อมูลของ เซคันด์มาร์เก็ต ระบุว่าเฟซบุกมีมูลค่า 41 พันล้านดอลลาร์สหรัฐ (แซงหน้าอีเบย์ไปเล็กน้อย) และถือเป็นบริษัทเว็บไซต์ที่ใหญ่ที่สุดในสหรัฐอเมริกาเป็นอันดับ 3 รองจากกูเกิลและแอมะซอน[40] สถิติผู้เข้าชมในเฟซบุ๊กหลังปี ค.ศ. 2009 ผู้ชมเฟซบุ๊กมากกว่ากูเกิลในปลายสัปดาห์ของสัปดาห์ 13 มีนาคม ค.ศ. 2010 [41]\n\nข้อพิพาทและการวิจารณ์","createdAt":1787276695027,"title":"TEEST"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('announcements/1787279055793', '{"author":"Admin_Summer","content":"NEWWWWWWWWWWWWWWWWWWWWWWWWWWWW","createdAt":1787279055793,"title":"TEST"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('announcements/1787763297891', '{"author":"Admin_Summer","content":"gm","createdAt":1787763297891,"title":"TEST"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('calc_icons', '{"can":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/canned.png","chili":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/Chili.png","fish":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/Herring.png","tomato":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/tomato.png"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('devils/1781817273323', '{"image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/abyssal-bloom-fruit.png","name":"Abyssal Bloom Fruit","status":"- สกิลพิเศษ : Unknown Abyss\n- เมื่อรับประทาน จะได้รับสถานะปริศนาเเบบสุ่ม\n- เอฟเฟกต์ที่ได้รับอาจเป็นได้ทั้งด้านบวกหรือด้านลบ","tier":"Mythic"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('devils/1781817285130', '{"image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/golden-spike-fruit.png","name":"Golden Spike Fruit","status":"- สกิลพิเศษ : Swift Revival\n- เมื่อรับประทาน จะได้รับสถานะพิเศษเป็นเวลา 30 นาที\n- ลดระยะเวลาในการชุบชีวิตลง 1.5 วินาที","tier":"EPIC"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('devils/1782150252517', '{"image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/cosmic-toxin-fruit.png","name":"Cosmic Toxin Fruit","status":"- สกิลพิเศษ : Cosmic Appetite\n- เมื่อรับประทาน จะได้รับสถานะพิเศษช่วยชะลอความหิว\n- อัตราการลดลงของค่าความหิวจะช้าลง 50%","tier":"Rare"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('devils/1782150548413', '{"image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/crimson-inferno-fruit.png","name":"Crimson Inferno Fruit","status":"- สกิลพิเศษ : Inferno Appetite\n- เมื่อรับประทาน จะได้รับสถานะพิเศษช่วยชะลอความหิว\n- อัตราการลดลงของค่าความหิวจะช้าลง 50%\n- พิ่มโอกาสตกปลาได้ง่ายขึ้น 20%\n- ระยะเวลาเอฟเฟกต์ 1 ชั่วโมง","tier":"Rare"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('devils/1782150869125', '{"image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/prism-thorn-fruit.png","name":"Prism Thorn Fruit","status":"- สกิลพิเศษ : Endless Appetite\n- เมื่อรับประทาน จะได้รับสถานะพิเศษเป็นเวลา 1 ชั่วโมง\n- ระหว่างติดสถานะ ค่าความหิวจะไม่ลดลง\n- ไอเทมนี้จะไม่ฟื้นฟูค่าความหิวโดยตรง","tier":"Legendary"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('devils/1782151046077', '{"image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/void-labyrinth-fruit.png","name":"Void Labyrinth Fruit","status":"- สกิลพิเศษ : Lucky Beast Aura\n- เมื่อรับประทาน จะได้รับสถานะพิเศษเป็นเวลา 1 ชั่วโมง\n- เพิ่มโอกาสได้รับ \"หมูลักกี้พิเศษ\" จากการเลี้ยงหมูเพิ่มขึ้น 10%\n- เอฟเฟกต์จะทำงานเฉพาะระหว่างกิจกรรมเลี้ยงหมูลักกี้เท่านั้น","tier":"EPIC"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('devils/1782151288685', '{"image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/emerald-venom-star-fruit.png","name":"Emerald Venom Star Fruit","status":"- สกิลพิเศษ : สกิลพิเศษ : Rapid Armor\n- เมื่อรับประทาน จะได้รับสถานะพิเศษเป็นเวลา 30 นาที\n- ลดระยะเวลาในการสวมใส่เกราะลง 1 วินาที","tier":"Legendary"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('devils/1782151499020', '{"image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/frostflame-core-fruit.png","name":"Frostflame Core Fruit","status":"- สกิลพิเศษ : Rapid Recovery\n- เมื่อรับประทาน จะได้รับสถานะพิเศษเป็นเวลา 30 นาที\n- ลดระยะเวลาในการใช้ยาฟื้นฟูลง 1 วินาที","tier":"EPIC"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('devils/1782151757660', '{"image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/verdant-demon-core-fruit.png","name":"Verdant Demon Core Fruit","status":"- สกิลพิเศษ : Endless Stamina\n- เมื่อรับประทาน จะได้รับสถานะพิเศษเป็นเวลา 30 นาที\n- ระหว่างติดสถานะ ค่าพลังงานการวิ่งจะไม่ลดลง","tier":"Legendary"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('devils/1785173754446', '{"image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/crystal-guard-fruit.png","name":"Crystal Guard Fruit","status":"- สกิลพิเศษ : Ice Barrier\n- เมื่อรับประทาน จะได้รับสถานะพิเศษเกราะนาโนกันกระสุนเหมือนใส่เกราะนาโน\n- เมื่อรับประทาน จะได้รับสถานะพิเศษเป็นเวลา 10 นาที","tier":"Mythic"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('devils/1786714835739', '{"image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/Thunder-Fruit.png","name":"Thunder Fruit","status":"- สกิลพิเศษ : Thunder Reflex\n- เมื่อรับประทาน จะได้รับสถานะพิเศษวิ่งไว 30%\n- เมื่อรับประทาน จะได้รับสถานะพิเศษเป็นเวลา 10 นาที","tier":"Mythic"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('devils/1786716601892', '{"image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/Immuna-Fruit.png","name":"Immuna Fruit","status":"- สกิลพิเศษ : Gravitational Drain\n- เมื่อรับประทาน จะได้รับสถานะพิเศษต้านสถานะผิดปกติ ไม่โดนสถานะใดๆ จากอาวุธภายในเมือง\n- เมื่อรับประทาน จะได้รับสถานะพิเศษเป็นเวลา 10 นาที","tier":"Mythic"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('eco_golden', 'false'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('eco_list/1785856624683', '{"image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/Khai.png","name":"เลี้ยงไข่ไดโนเสาร์ 🦖","note":"","status":"BUFF"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('eco_list/1785856846876', '{"image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/KAPONG.png","name":"ปลากระป๋องรอบเมือง","note":"","status":"BUFF"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('eco_list/1787611155718', '{"image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/Fish-Vi.png","name":"งานตกปลาน้ำลึก 🦈","note":"","status":"BUFF"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('eco_list/1787611208547', '{"image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/PIG-FRAM.png","name":"งานเลี้ยงหมู 🐽","note":"","status":"BUFF"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('eco_list/1788653353786', '{"image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/งานเบ็ดตกปลา.png","name":"งานตกปลาเบ็ด LV","note":"","status":"BUFF"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('eco_list/1788653818129', '{"image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/งานเเร่เกาะลอยฟ้า.png","name":"เกาะลอยฟ้า x2","note":"48 ชม.","status":"BUFF"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('eco_list/1788653851921', '{"image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/งานเหล็ก.png","name":"งานฟาร์มเหล็ก x2","note":"48 ชม.","status":"NERF"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('eco_list/1788653882408', '{"image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/งานไม้.png","name":"งานตัดไม้ x2","note":"48 ชม.","status":"NERF"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('eco_list/1788653911920', '{"image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/งานเหมือง.png","name":"งานเหมืองเเร่ x2","note":"48 ชม.","status":"NERF"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('eco_list/1789391405012', '{"image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/pakarang.png","name":"งานดำน้ำปะการัง","note":"","status":"NERF"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('eco_time', '"12/09/2569"'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('event_slot_images/0430', '["https://i.postimg.cc/qBLbqm76/justdance.png"]'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('events/1790251652711', '{"detail":"","name":"กิจกรรม Color Zone","time":"13:00 / 16:00 / 18:00 / 19:00 / 20:00 / 21:00 / 22:00 / 23:00 / 00:00 / 01:00 / 02:30 / 05:30 / 08:30 / 11:30"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('events/1790251936207', '{"detail":"","name":"กิจกรรม CHAMELEON","time":"13:30 / 16:30 / 18:30 / 19:30 / 20:30 / 21:30 / 22:30 / 23:30 / 00:30 / 01:30 / 03:00 / 06:00 / 09:00"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('events/1790251968766', '{"detail":"","name":"กิจกรรม EATER EGG","time":"14:30 / 17:30 / 18:30 / 19:30 / 20:30 / 21:30 / 22:30 / 23:30 / 00:30 / 01:30 / 03:30 / 06:30 / 09:30"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('events/1790252067343', '{"detail":"","name":"กิจกรรม BB","time":"14:00 / 18:15 / 20:15 / 22:15 / 00:15 / 04:00 / 07:00 / 10:00"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('events/1790252088118', '{"detail":"","name":"กิจกรรม TDM","time":"15:00 / 19:15 / 21:15 / 23:15 / 01:15 / 05:00 / 08:00 / 11:00"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('events/1792966303556', '{"detail":"","image":"","name":"Justdance","time":"12:30 / 15:30 / 18:00 / 19:00 / 20:00 / 21:00 / 22:00 / 23:00 / 00:00 / 01:00 / 02:00 / 04:30 / 07:30 / 10:30"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1781816744555', '{"category":"แฟชั่น Topdonate","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/phoenix-fire.png","name":"Phoenix Fire","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x3 🍀\nพิเศษ เพิ่มหลอดอาหาร 10% ทุกๆ 10 วินาที 🍖\nพิเศษ เพิ่มหลอดน้ำดื่มพลัส 10% ทุกๆ 10 วิ 💧"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1781816795579', '{"category":"แฟชั่น Topdonate","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/crownm.png","name":"Crownm","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x3 🍀\nพิเศษ เพิ่มหลอดอาหาร 10% ทุกๆ 10 วินาที 🍖\nพิเศษ เพิ่มหลอดน้ำดื่มพลัส 10% ทุกๆ 10 วิ 💧"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1781826746288', '{"category":"แฟชั่น Topdonate","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/Crownmx21.png","name":"Crownmx2","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x3 🍀\nพิเศษ เพิ่มหลอดอาหาร 10% ทุกๆ 10 วินาที 🍖\nพิเศษ เพิ่มหลอดน้ำดื่มพลัส 10% ทุกๆ 10 วิ 💧"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1781826899072', '{"category":"แฟชั่น Topdonate","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/Crownwm.png","name":"Crownwm","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x3 🍀\nพิเศษ เพิ่มหลอดอาหาร 10% ทุกๆ 10 วินาที 🍖\nพิเศษ เพิ่มหลอดน้ำดื่มพลัส 10% ทุกๆ 10 วิ 💧"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1781827088428', '{"category":"แฟชั่นประมูล","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/ZoroSamurai.png","name":"Zoro Samurai","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1781827277359', '{"category":"แฟชั่นประมูล","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/MihawkProp.png","name":"Mihawk Prop","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1781830242988', '{"category":"แฟชั่นประมูล","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/Kikoku.png","name":"Kikoku","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1781830333380', '{"category":"แฟชั่นประมูล","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/KokutoYoru.png","name":"Kokuto Yoru","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1781830460398', '{"category":"แฟชั่น Celebrity","image":"https://img2.pic.in.th/--9f88a1d83e9e0ad22.png","name":"Bean blue","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x3 🍀\n- ฟื้นฟู HP 100% หลังใส่ผ่านไป 10 วินาที ❤️‍🔥"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1781830622124', '{"category":"แฟชั่น Celebrity","image":"https://img1.pic.in.th/images/--1032b86d427a3411ba.png","name":"Bean gold","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x3 🍀\n- ฟื้นฟู HP 100% หลังใส่ผ่านไป 10 วินาที ❤️‍🔥"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1781830703556', '{"category":"แฟชั่น Celebrity","image":"https://img2.pic.in.th/--11be3bf842ee43ec76.png","name":"Bean Red","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x3 🍀\n- ฟื้นฟู HP 100% หลังใส่ผ่านไป 10 วินาที ❤️‍🔥"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1781831049166', '{"category":"แฟชั่น Celebrity","image":"https://img1.pic.in.th/images/--12.png","name":"Itimceleb 1","status":"- กันร้อน 🌞"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782640379116', '{"category":"แฟชั่น Celebrity","image":"https://img2.pic.in.th/--14a3b96fe270e4cd50.png","name":"Itimceleb 2","status":"- กันร้อน 🌞"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782640551196', '{"category":"แฟชั่น Celebrity","image":"https://img2.pic.in.th/--153c6b738980b97aec.png","name":"Itimceleb 3","status":"- กันร้อน 🌞"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782640646876', '{"category":"แฟชั่น Celebrity","image":"https://img1.pic.in.th/images/--1647d209476b2964a4.png","name":"Itimceleb 4","status":"- กันร้อน 🌞"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782640746452', '{"category":"แฟชั่น Celebrity","image":"https://img1.pic.in.th/images/--17b0dcc71cddd3af48.png","name":"Pig Cute","status":"- กันร้อน 🌞"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782797102527', '{"category":"แฟชั่น Celebrity","image":"https://img2.pic.in.th/--18.png","name":"Punicorn","status":"- กันร้อน 🌞"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782797429918', '{"category":"แฟชั่น Celebrity","image":"https://img2.pic.in.th/--1904b95f25a63c9591.png","name":"Pudevil","status":"- กันร้อน 🌞"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782797587558', '{"category":"แฟชั่น Celebrity","image":"https://img2.pic.in.th/--20ca7eba91e3f85b54.png","name":"Pugold","status":"- กันร้อน 🌞"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782797844722', '{"category":"แฟชั่น Celebrity","image":"https://img2.pic.in.th/--227b47a569be732a55.png","name":"Pwing","status":"- กันร้อน 🌞"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782798214750', '{"category":"แฟชั่น Celebrity","image":"https://img1.pic.in.th/images/--2109efae8ddafaa5c0.png","name":"Hz Pig Cute 1","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- โชค x1 🍀"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782798476170', '{"category":"แฟชั่น Celebrity","image":"https://img2.pic.in.th/--23c71f18ca00d5ae16.png","name":"Celebity Geom","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782798633217', '{"category":"แฟชั่น Celebrity","image":"https://img2.pic.in.th/--24e0c51c13b7dea01a.png","name":"Heart","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x3 🍀\nพิเศษ เพิ่มหลอดอาหาร 10% ทุกๆ 10 วินาที 🍖\nพิเศษ เพิ่มหลอดน้ำดื่มพลัส 10% ทุกๆ 10 วิ 💧"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782798733390', '{"category":"แฟชั่น Celebrity","image":"https://img1.pic.in.th/images/--25a912cce1063e9def.png","name":"Thunder","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x3 🍀\nพิเศษ เพิ่มหลอดอาหาร 10% ทุกๆ 10 วินาที 🍖\nพิเศษ เพิ่มหลอดน้ำดื่มพลัส 10% ทุกๆ 10 วิ 💧"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782799464797', '{"category":"แฟชั่น Celebrity","image":"https://img1.pic.in.th/images/-81aec53933b86479.png","name":"Somdej M","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- โชค x3 🍀"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782799487029', '{"category":"แฟชั่น Celebrity","image":"https://img1.pic.in.th/images/-81aec53933b86479.png","name":"Somdej FM","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- โชค x3 🍀"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782799639302', '{"category":"แฟชั่น Celebrity","image":"https://img2.pic.in.th/--1e18fef0328001350.png","name":"Magician 03","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x3 🍀\nพิเศษ เพิ่มหลอดอาหาร 10% ทุกๆ 10 วินาที 🍖"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782799788334', '{"category":"แฟชั่น Celebrity","image":"https://img2.pic.in.th/--28238762432461be0.png","name":"Magician 04","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x3 🍀\nพิเศษ เพิ่มหลอดน้ำดื่มพลัส 10% ทุกๆ 10 วิ 💧"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782800217518', '{"category":"แฟชั่น Celebrity","image":"https://img2.pic.in.th/--3d4c44473d94d3fec.png","name":"Ger L","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- โชค x2 🍀"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782800312493', '{"category":"แฟชั่น Celebrity","image":"https://img2.pic.in.th/--480de193cac9ac22f.png","name":"Ger R","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- โชค x2 🍀"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782800446309', '{"category":"แฟชั่น Celebrity","image":"https://img2.pic.in.th/--5c579037793ccc647.png","name":"Protara Green","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x2 🍀"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782805033076', '{"category":"แฟชั่น Celebrity","image":"https://img1.pic.in.th/images/--6132ef8897efdea72.png","name":"Oer L","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- โชค x2 🍀"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782805092102', '{"category":"แฟชั่น Celebrity","image":"https://img2.pic.in.th/--752438a1fbe676a42.png","name":"Oer R","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- โชค x2 🍀"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782805276731', '{"category":"แฟชั่น Celebrity","image":"https://img1.pic.in.th/images/--851a829fd8b151302.png","name":"Protara Orang","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x2 🍀"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782805449691', '{"category":"แฟชั่น Celebrity","image":"https://img2.pic.in.th/--922bce10d26591a75.png","name":"Cartier G","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x3 🍀"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782805560872', '{"category":"แฟชั่น Celebrity","image":"https://img1.pic.in.th/images/--10396b2e0ebe4cc446.png","name":"Cartier S","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x3 🍀"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782806177941', '{"category":"แฟชั่น Celebrity","image":"https://img2.pic.in.th/--11379022debf830019.png","name":"Tail Fox B","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- โชค x1 🍀"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782806341339', '{"category":"แฟชั่น Celebrity","image":"https://img2.pic.in.th/--12f018b3baa30a1653.png","name":"Tail Fox P","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- โชค x1 🍀"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782806430992', '{"category":"แฟชั่น Celebrity","image":"https://img1.pic.in.th/images/--133f461eb7776a0374.png","name":"Tail Fox W","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- โชค x1 🍀"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782806591402', '{"category":"แฟชั่น Celebrity","image":"https://img1.pic.in.th/images/--14bdcf175334577dc7.png","name":"Cloudring","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- โชค x2 🍀"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782806701066', '{"category":"แฟชั่น Celebrity","image":"https://img2.pic.in.th/--15bd2865f89ab64787.png","name":"Stormring","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- โชค x2 🍀"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782806888947', '{"category":"แฟชั่น Celebrity","image":"https://img1.pic.in.th/images/--16570dbb5bd354c381.png","name":"Sunring","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- โชค x2 🍀"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782807064773', '{"category":"แฟชั่น Celebrity","image":"https://img2.pic.in.th/--177b30752e806c9a25.png","name":"Thunderring","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- โชค x2 🍀"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782807164154', '{"category":"แฟชั่น Celebrity","image":"https://img2.pic.in.th/--1877c0ac8a2728e1f3.png","name":"Rainring","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- โชค x2 🍀"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782807275597', '{"category":"แฟชั่น Celebrity","image":"https://img2.pic.in.th/--19c46d3625320073be.png","name":"Mistring","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- โชค x2 🍀"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782807387460', '{"category":"แฟชั่น Celebrity","image":"https://img2.pic.in.th/--201e4c202a00f61545.png","name":"Skyring","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- โชค x2 🍀\n- สไลด์ไว ⚡"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782807608234', '{"category":"แฟชั่น Topdonate","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/DDSJellyPotHat.png","name":"DDS Jelly Pot Hat","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x3 🍀\nพิเศษ เพิ่มหลอดอาหาร 10% ทุกๆ 10 วินาที 🍖\nพิเศษ เพิ่มหลอดน้ำดื่มพลัส 10% ทุกๆ 10 วิ 💧"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782807784353', '{"category":"แฟชั่น Celebrity","image":"https://img2.pic.in.th/--22ce06a64d762edf12.png","name":"London Balck Cat V9","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782807944591', '{"category":"แฟชั่น Celebrity","image":"https://img2.pic.in.th/--23a78d089496c999da.png","name":"London Tiger Cat V9","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782808046890', '{"category":"แฟชั่น Celebrity","image":"https://img2.pic.in.th/--24406e6b2791da9c55.png","name":"London White Cat V9","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782808239698', '{"category":"แฟชั่นกิจกรรม","image":"https://img1.pic.in.th/images/--253cca0def424d9b66.png","name":"Boa Hancock","status":"- กันร้อน 🌞"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782808594937', '{"category":"แฟชั่นกิจกรรม","image":"https://img2.pic.in.th/--26c1753dec1557c81f.png","name":"Smoker Weapon","status":"- กันร้อน 🌞"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782808710919', '{"category":"แฟชั่นกิจกรรม","image":"https://img2.pic.in.th/--2787a8183ce8ac8483.png","name":"Hatsluffy","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782808853884', '{"category":"แฟชั่นกิจกรรม","image":"https://img1.pic.in.th/images/--28dda595d9405a1e86.png","name":"Hatsace","status":"- กันร้อน 🌞"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782809046888', '{"category":"แฟชั่นปกติ","image":"https://img1.pic.in.th/images/--299be3f5d433f38ecc.png","name":"Starmagic Cat","status":"- กันร้อน 🌞"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782809448143', '{"category":"แฟชั่นปกติ","image":"https://img1.pic.in.th/images/--309f4b263caa561154.png","name":"Starmagic Bear","status":"- กันร้อน 🌞"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782809594240', '{"category":"แฟชั่นปกติ","image":"https://img2.pic.in.th/--317789dd3c964a29ae.png","name":"Juan1","status":"- กันร้อน 🌞"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782809692170', '{"category":"แฟชั่นปกติ","image":"https://img1.pic.in.th/images/--327a5525ec3c418d05.png","name":"Snow","status":"- กันร้อน 🌞"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782809831225', '{"category":"แฟชั่นกิจกรรม","image":"https://img1.pic.in.th/images/--33.png","name":"Bigmum Napoleon Hat","status":"- กันร้อน 🌞"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782809957528', '{"category":"แฟชั่นปกติ","image":"https://img1.pic.in.th/images/--3463a85a109c92c8c3.png","name":"Hirono V3 Four","status":"- กันร้อน 🌞"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782888393399', '{"category":"แฟชั่นปกติ","image":"https://img2.pic.in.th/--353af8346c24e7e38c.png","name":"Coolkids Christmas 5","status":"- กันร้อน 🌞"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782888880280', '{"category":"แฟชั่นปกติ","image":"https://img2.pic.in.th/-cc6b92a781d7eeb8.png","name":"Halloween Zombie","status":"- หลอดอาหารลดช้า 🍗"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782888996302', '{"category":"แฟชั่นปกติ","image":"https://img2.pic.in.th/--1075969708e122029.png","name":"Halloween Witch","status":"- หลอดอาหารลดช้า 🍗"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782889095758', '{"category":"แฟชั่นปกติ","image":"https://img2.pic.in.th/--275cda850c1ccfb58.png","name":"Halloween Ghost","status":"- หลอดอาหารลดช้า 🍗"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782889218394', '{"category":"แฟชั่นปกติ","image":"https://img1.pic.in.th/images/--3703b6c176273c817.png","name":"Halloween Pumpkin","status":"- หลอดอาหารลดช้า 🍗"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782889468325', '{"category":"แฟชั่นปกติ","image":"https://img1.pic.in.th/images/--5a971ee3b65b7de2f.png","name":"Halloween Vampire","status":"- หลอดอาหารลดช้า 🍗"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782889664133', '{"category":"แฟชั่นกิจกรรม","image":"https://img2.pic.in.th/--65bd5399f98a433b0.png","name":"Pumpkinsummer","status":"- หลอดอาหารลดช้า 🍗"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1782889796921', '{"category":"แฟชั่นกิจกรรม","image":"https://img2.pic.in.th/--71fd9349085e2ce09.png","name":"Chopper 2","status":"- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1783066850224', '{"category":"แฟชั่นกิจกรรม","image":"https://img1.pic.in.th/images/-d7db9a5155144eb8.png","name":"Aokiji Coat","status":"- หลอดอาหารลดช้า 🍗"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1783067514697', '{"category":"แฟชั่นกิจกรรม","image":"https://img2.pic.in.th/--1556985322b14b7e5.png","name":"Garp Coat","status":"- หลอดอาหารลดช้า 🍗"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1783067697593', '{"category":"แฟชั่นปกติ","image":"https://img1.pic.in.th/images/--28c07c80e892dbb2d.png","name":"Dmsptravel 5","status":"- หลอดอาหารลดช้า 🍗"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1783067971816', '{"category":"แฟชั่นกิจกรรม","image":"https://img1.pic.in.th/images/--3-Photoroom.png","name":"Magellan Wings","status":"- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1783068168323', '{"category":"แฟชั่นกิจกรรม","image":"https://img2.pic.in.th/--4eb54e88853505fac.png","name":"Luffy Meat","status":"- หลอดอาหารลดช้า 🍗"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1783068332993', '{"category":"แฟชั่นปกติ","image":"https://img2.pic.in.th/--59ca15a0c42cbd1c7.png","name":"Fashion UI65 3","status":"- ช่วยให้ดำน้ำได้นานขึ้น 🤿"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1783069131142', '{"category":"แฟชั่นปกติ","image":"https://img1.pic.in.th/images/--62308c9e38bb98dc1.png","name":"Labubu Shark","status":"- กันร้อน 🌞"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1789135414091', '{"category":"แฟชั่น Topdonate","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/wingblack.png","name":"Black Wings","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x3 🍀\nพิเศษ เพิ่มหลอดอาหาร 10% ทุกๆ 10 วินาที 🍖\nพิเศษ เพิ่มหลอดน้ำดื่มพลัส 10% ทุกๆ 10 วิ 💧"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1789135645292', '{"category":"แฟชั่น Topdonate","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/wingpink.png","name":"Pink Wings","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x3 🍀\nพิเศษ เพิ่มหลอดอาหาร 10% ทุกๆ 10 วินาที 🍖\nพิเศษ เพิ่มหลอดน้ำดื่มพลัส 10% ทุกๆ 10 วิ 💧"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1789135809628', '{"category":"แฟชั่น Topdonate","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/wingblue.png","name":"Blue Wings","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x3 🍀\nพิเศษ เพิ่มหลอดอาหาร 10% ทุกๆ 10 วินาที 🍖\nพิเศษ เพิ่มหลอดน้ำดื่มพลัส 10% ทุกๆ 10 วิ 💧"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1789135848707', '{"category":"แฟชั่น Topdonate","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/winggreen.png","name":"Green Wings","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x3 🍀\nพิเศษ เพิ่มหลอดอาหาร 10% ทุกๆ 10 วินาที 🍖\nพิเศษ เพิ่มหลอดน้ำดื่มพลัส 10% ทุกๆ 10 วิ 💧"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1789135918171', '{"category":"แฟชั่น Topdonate","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/wingyellow.png","name":"Yellow Wings","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x3 🍀\nพิเศษ เพิ่มหลอดอาหาร 10% ทุกๆ 10 วินาที 🍖\nพิเศษ เพิ่มหลอดน้ำดื่มพลัส 10% ทุกๆ 10 วิ 💧"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1789135968547', '{"category":"แฟชั่น Topdonate","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/wingwegiht.png","name":"White Wings","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x3 🍀\nพิเศษ เพิ่มหลอดอาหาร 10% ทุกๆ 10 วินาที 🍖\nพิเศษ เพิ่มหลอดน้ำดื่มพลัส 10% ทุกๆ 10 วิ 💧"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1789135993773', '{"category":"แฟชั่น Topdonate","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/wingred.png","name":"Red Wings","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x3 🍀\nพิเศษ เพิ่มหลอดอาหาร 10% ทุกๆ 10 วินาที 🍖\nพิเศษ เพิ่มหลอดน้ำดื่มพลัส 10% ทุกๆ 10 วิ 💧"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1789136404668', '{"category":"แฟชั่น Topdonate","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/blackbakalet.png","name":"Black Bracelet M / FM","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x3 🍀\nพิเศษ เพิ่มหลอดอาหาร 10% ทุกๆ 10 วินาที 🍖\nพิเศษ เพิ่มหลอดน้ำดื่มพลัส 10% ทุกๆ 10 วิ 💧"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1789136511203', '{"category":"แฟชั่น Topdonate","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/blackbacalet.png","name":"Black Bracelet (Left) M / FM","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x3 🍀\nพิเศษ เพิ่มหลอดอาหาร 10% ทุกๆ 10 วินาที 🍖\nพิเศษ เพิ่มหลอดน้ำดื่มพลัส 10% ทุกๆ 10 วิ 💧"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1789137863954', '{"category":"แฟชั่น Topdonate","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/blackbacaletF.png","name":"Black Bracelet (Right) M / FM","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x3 🍀\nพิเศษ เพิ่มหลอดอาหาร 10% ทุกๆ 10 วินาที 🍖\nพิเศษ เพิ่มหลอดน้ำดื่มพลัส 10% ทุกๆ 10 วิ 💧"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1789138972166', '{"category":"แฟชั่น Topdonate","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/BlackbakaleD.png","name":"Black Earring M / FM","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x3 🍀\nพิเศษ เพิ่มหลอดอาหาร 10% ทุกๆ 10 วินาที 🍖\nพิเศษ เพิ่มหลอดน้ำดื่มพลัส 10% ทุกๆ 10 วิ 💧"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1789139185514', '{"category":"แฟชั่น Topdonate","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/blackEarl.png","name":"Black Earring (Left / Right)","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x3 🍀\nพิเศษ เพิ่มหลอดอาหาร 10% ทุกๆ 10 วินาที 🍖\nพิเศษ เพิ่มหลอดน้ำดื่มพลัส 10% ทุกๆ 10 วิ 💧"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1789149349721', '{"category":"แฟชั่น Topdonate","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/Greenbakalet.png","name":"Green Bracelet M / FM","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x3 🍀\nพิเศษ เพิ่มหลอดอาหาร 10% ทุกๆ 10 วินาที 🍖\nพิเศษ เพิ่มหลอดน้ำดื่มพลัส 10% ทุกๆ 10 วิ 💧"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1789149425910', '{"category":"แฟชั่น Topdonate","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/Greenbakale.png","name":"Green Bracelet (Left) M / FM","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x3 🍀\nพิเศษ เพิ่มหลอดอาหาร 10% ทุกๆ 10 วินาที 🍖\nพิเศษ เพิ่มหลอดน้ำดื่มพลัส 10% ทุกๆ 10 วิ 💧"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1789149484816', '{"category":"แฟชั่น Topdonate","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/GreenbakaleD.png","name":"Green Bracelet (Right) M / FM","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x3 🍀\nพิเศษ เพิ่มหลอดอาหาร 10% ทุกๆ 10 วินาที 🍖\nพิเศษ เพิ่มหลอดน้ำดื่มพลัส 10% ทุกๆ 10 วิ 💧"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1789149585685', '{"category":"แฟชั่น Topdonate","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/GreenEar.png","name":"Green Earring M / FM","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x3 🍀\nพิเศษ เพิ่มหลอดอาหาร 10% ทุกๆ 10 วินาที 🍖\nพิเศษ เพิ่มหลอดน้ำดื่มพลัส 10% ทุกๆ 10 วิ 💧"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('fashions/1789150330913', '{"category":"แฟชั่น Topdonate","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/GreenEara.png","name":"Green Earring (Left / Right)","status":"- กันร้อน 🌞\n- หลอดอาหารลดช้า 🍗\n- ช่วยให้ดำน้ำได้นานขึ้น 🤿\n- สไลด์ไว ⚡\n- โชค x3 🍀\nพิเศษ เพิ่มหลอดอาหาร 10% ทุกๆ 10 วินาที 🍖\nพิเศษ เพิ่มหลอดน้ำดื่มพลัส 10% ทุกๆ 10 วิ 💧"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('foods/1782002030728', '{"craft":"- ไม้ที่ยังไม่เเปรรูป = 2 EA\n- ปลา Crimson Fish = 1 EA","desc":"- ฟื้นฟูค่าความหิว 100 หน่วย\n- ได้รับสถานะพิเศษ \" อิ่มนาน \" เป็นเวลา 120 นาที\n- ระหว่างติดสถานะ อัตราการลดลงของค่าความหิวจะช้าลงกว่าปกติ","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/steak-crimson.png","ingredientImgs":["https://img1.pic.in.th/images/--18708d66935efd3722.png","https://img2.pic.in.th/--17f48dc64f246058bf.png"],"name":"Steak Crimson","tier":"ทอง"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('foods/1782005977275', '{"craft":"- ไม้ที่ยังไม่เเปรรูป = 2 EA\n- ปลา Herring = 2 EA","desc":"- ฟื้นฟูค่าความหิว 25 หน่วย","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/steak-fish.png","ingredientImgs":["https://img1.pic.in.th/images/--18708d66935efd3722.png","https://img1.pic.in.th/images/--206085023f26d85a55.png"],"name":"Steak Fish","tier":"เขียว"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('foods/1782006473554', '{"craft":"- ไม้ที่ยังไม่เเปรรูป = 2 EA\n- ปลา Dorado Fish = 1 EA","desc":"- ฟื้นฟูค่าความหิว 100 หน่วย\n- ได้รับสถานะพิเศษ \" อิ่มนาน \" เป็นเวลา 60 นาที\n- ระหว่างติดสถานะ อัตราการลดลงของค่าความหิวจะช้าลงกว่าปกติ","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/steak-dorado.png","ingredientImgs":["https://img1.pic.in.th/images/--18708d66935efd3722.png","https://img2.pic.in.th/--21bd958c7c1298072b.png"],"name":"Steak Dorado","tier":"ม่วง"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('foods/1782077753866', '{"craft":"- ไม้ที่ยังไม่เเปรรูป = 2 EA\n- ปลา Flounder Fish = 1 EA","desc":"- ฟื้นฟูค่าความหิว 100 หน่วย\n- ได้รับสถานะพิเศษ \" อิ่มนาน \" เป็นเวลา 60 นาที\n- ระหว่างติดสถานะ อัตราการลดลงของค่าความหิวจะช้าลงกว่าปกติ","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/steak-flounder.png","ingredientImgs":["https://img1.pic.in.th/images/--18708d66935efd3722.png","https://img1.pic.in.th/images/--23.png"],"name":"Steak Flounder","tier":"ม่วง"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('foods/1782078154673', '{"craft":"- ไม้ที่ยังไม่เเปรรูป = 2 EA\n- ปลา Ghost Fish = 1 EA","desc":"- ฟื้นฟูค่าความหิว 100 หน่วย\n- ได้รับสถานะพิเศษ \" อิ่มนาน \" เป็นเวลา 60 นาที\n- ระหว่างติดสถานะ อัตราการลดลงของค่าความหิวจะช้าลงกว่าปกติ","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/steak-ghostfish.png","ingredientImgs":["https://img1.pic.in.th/images/--18708d66935efd3722.png","https://img2.pic.in.th/--254c3bbde55886c2bc.png"],"name":"Steak Ghostfish","tier":"ม่วง"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('foods/1782078328641', '{"craft":"- ไม้ที่ยังไม่เเปรรูป = 2 EA\n- ปลา Halibut Fish = 1 EA","desc":"- ฟื้นฟูค่าความหิว 100 หน่วย\n- ได้รับสถานะพิเศษ \" อิ่มนาน \" เป็นเวลา 60 นาที\n- ระหว่างติดสถานะ อัตราการลดลงของค่าความหิวจะช้าลงกว่าปกติ","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/steak-halibut.png","ingredientImgs":["https://img1.pic.in.th/images/--18708d66935efd3722.png","https://img2.pic.in.th/--27362f7135d93df020.png"],"name":"Steak Halibut","tier":"ม่วง"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('foods/1782078697025', '{"craft":"- ไม้ที่ยังไม่เเปรรูป = 2 EA\n- ปลา Ice pip Fish = 1 EA","desc":"- ฟื้นฟูค่าความหิว 100 หน่วย\n- ได้รับสถานะพิเศษ \" อิ่มนาน \" เป็นเวลา 120 นาที\n- ระหว่างติดสถานะ อัตราการลดลงของค่าความหิวจะช้าลงกว่าปกติ","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/steak-icepip.png","ingredientImgs":["https://img1.pic.in.th/images/--18708d66935efd3722.png","https://img1.pic.in.th/images/--29.png"],"name":"Steak Icepip","tier":"ทอง"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('foods/1782079008680', '{"craft":"- ไม้ที่ยังไม่เเปรรูป = 2 EA\n- ปลา Largemouth Bass Fish = 1 EA","desc":"- ฟื้นฟูค่าความหิว 100 หน่วย\n- ได้รับสถานะพิเศษ \" อิ่มนาน \" เป็นเวลา 60 นาที\n- ระหว่างติดสถานะ อัตราการลดลงของค่าความหิวจะช้าลงกว่าปกติ","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/steak-largemouth-bass.png","ingredientImgs":["https://img1.pic.in.th/images/--18708d66935efd3722.png","https://img1.pic.in.th/images/--31df0693f922abd8c7.png"],"name":"Steak Largemouth Bass","tier":"ม่วง"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('foods/1782079302128', '{"craft":"- ไม้ที่ยังไม่เเปรรูป = 2 EA\n- ปลา Scorpion Carp Fish = 1 EA","desc":"- ฟื้นฟูค่าความหิว 100 หน่วย\n- ได้รับสถานะพิเศษ \" อิ่มนาน \" เป็นเวลา 120 นาที\n- ระหว่างติดสถานะ อัตราการลดลงของค่าความหิวจะช้าลงกว่าปกติ","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/steak-scorpion.png","ingredientImgs":["https://img1.pic.in.th/images/--18708d66935efd3722.png","https://img2.pic.in.th/--33.png"],"name":"Steak Scorpion","tier":"ทอง"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('foods/1782079581280', '{"craft":"- ไม้ที่ยังไม่เเปรรูป = 2 EA\n- ปลา Stingray Fish = 1 EA","desc":"- ฟื้นฟูค่าความหิว 100 หน่วย\n- ได้รับสถานะพิเศษ \" อิ่มนาน \" เป็นเวลา 120 นาที\n- ระหว่างติดสถานะ อัตราการลดลงของค่าความหิวจะช้าลงกว่าปกติ","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/steak-stingray.png","ingredientImgs":["https://img1.pic.in.th/images/--18708d66935efd3722.png","https://img1.pic.in.th/images/--35.png"],"name":"Steak Stingray","tier":"ทอง"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('foods/1782079959728', '{"craft":"- ไม้ที่ยังไม่เเปรรูป = 2 EA\n- ปลา Void Salmon Fish = 1 EA","desc":"- ฟื้นฟูค่าความหิว 100 หน่วย\n- ได้รับสถานะพิเศษ \" อิ่มนาน \" เป็นเวลา 120 นาที\n- ระหว่างติดสถานะ อัตราการลดลงของค่าความหิวจะช้าลงกว่าปกติ","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/steak-voidsalmon.png","ingredientImgs":["https://img1.pic.in.th/images/--18708d66935efd3722.png","https://img1.pic.in.th/images/--37.png"],"name":"Steak Void Salmon","tier":"ทอง"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('gacha_banner', '{"desc":"กดเพื่อดูรายละเอียดของในร้านค้า SUMMER CITY SHOP","images":[{"focus":75,"url":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/GACHAss3.png"},{"focus":46,"url":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/summer02.jpg"},{"focus":50,"url":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/เเพ็กฟาร์มใหม่.png"},{"focus":60,"url":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/Goldcarss3.png"},{"focus":14,"url":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/summer01.jpg"}],"saleVisible":true,"title":"NEW!!! 🔥GACHA DONATE SUMMER CITY SS2 📦","titles":["NEW!!! 🔥GACHA DONATE SUMMER CITY SS2 📦","👑 PACK FARM ระดับสูง — 999 บาท","🔥 PACK FARM ระดับกลาง — 499 บาท","💸 PACK FARM เริ่มต้น [งานรอบเมือง] — 99 บาท"]}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('gacha_categories/1782174771670', '{"color":"#ec4899","name":"GACHA DONATE SS1📦","order":0}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('gacha_categories/1782512057347', '{"color":"#f97316","name":"PACK FARM 🥦🌾","order":4}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('gacha_items/1782176074127', '{"categoryId":"1782174771670","detail":"รถบินสายฟ้า พาหนะพิเศษดีไซน์รูปสายฟ้า สามารถโดยสารได้ 2 ที่นั่ง ใช้สำหรับเดินทางบนท้องฟ้า\nเงื่อนไขการได้รับ : สนับสนุนซัพพอร์ตกาชาโดเนทยอดสะสมครบ 50,000 บาท รับทันที","image":"https://img1.pic.in.th/images/--60.png","name":"Flying Car"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('gacha_items/1782432709702', '{"categoryId":"1782174771670","detail":"","image":"https://img2.pic.in.th/--63.png","name":"Top Donate Car"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('gacha_items/1782432861822', '{"categoryId":"1782174771670","detail":"","image":"https://img1.pic.in.th/images/--62.png","name":"100K Tier Car"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('gacha_items/1782433118095', '{"categoryId":"1782174771670","detail":"","image":"https://img2.pic.in.th/--64.png","name":"Golden Ticket Car"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('gacha_items/1782433223207', '{"categoryId":"1782174771670","detail":"","image":"https://img2.pic.in.th/--65.png","name":"30K Tier Car"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('gacha_items/1782433430854', '{"categoryId":"1782174771670","detail":"","image":"https://img2.pic.in.th/--66.png","name":"Gacha Car"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('gacha_items/1782510461539', '{"categoryId":"1782174771670","detail":"","image":"https://img1.pic.in.th/images/--26-Photoroom.png","name":"Thunder"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('gacha_items/1782510575220', '{"categoryId":"1782174771670","detail":"","image":"https://img2.pic.in.th/--27-Photoroom.png","name":"Heart"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('gacha_items/1782510843643', '{"categoryId":"1782174771670","detail":"","image":"https://img1.pic.in.th/images/--5906f0caa72f512680.png","name":"Labubu Gray"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('gacha_items/1782510968379', '{"categoryId":"1782174771670","detail":"","image":"https://img2.pic.in.th/--60.png","name":"Labubu Pink"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('gacha_items/1782511066356', '{"categoryId":"1782174771670","detail":"","image":"https://img2.pic.in.th/--61412cbcc6d44ed4e9.png","name":"Labubu Yellow"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('gacha_items/1782511167908', '{"categoryId":"1782174771670","detail":"","image":"https://img2.pic.in.th/--62.png","name":"Labubu Blue"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('gacha_items/1782511255179', '{"categoryId":"1782174771670","detail":"","image":"https://img2.pic.in.th/--63973571e848e94cca.png","name":"Labubu Milk"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('gacha_items/1782511444739', '{"categoryId":"1782174771670","detail":"","image":"https://img2.pic.in.th/--64dde16aa26a3ead66.png","name":"Labubu Toffy"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('gacha_items/1782511543533', '{"categoryId":"1782174771670","detail":"สถานะพิเศษ กันร้อน 🔥","image":"https://img2.pic.in.th/--654a2fbb2ccd762644.png","name":"Labubu Shark"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('gacha_items/1782511715862', '{"categoryId":"1782174771670","detail":"","image":"https://img1.pic.in.th/images/--68.png","name":"Labubu Green"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('gacha_items/1782512098979', '{"categoryId":"1782512057347","detail":"• บัตรฟาร์มออโต้ (งานรอบเมือง) 1 วัน\n• สเต็กปลา (Steak Dorado) 10 ชิ้น\n• ไอศกรีมคลายร้อน 10 แท่ง\n• น้ำดื่มพลัส 5 ขวด","image":"https://img2.pic.in.th/--69.png","name":"💸 PACK FARM เริ่มต้น งานรอบเมือง 99 บาท"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('gacha_items/1782512123739', '{"categoryId":"1782512057347","detail":"• บัตรฟาร์มออโต้ (งานรอบเมือง) 7 วัน\n• บัตรฟาร์มออโต้ตกปลา Herring 7 วัน\n• สเต็กปลา (Steak Dorado) 15 ชิ้น\n• ไอศกรีมคลายร้อน 10 แท่ง\n• น้ำดื่มพลัส 5 ขวด\n• ผลไม้สกิลหิวช้า 2 ชิ้น\n• พิเศษ! กล่องสุ่มแฟชั่น 1 กล่อง (สุ่มได้ 6 แบบ)","image":"https://img2.pic.in.th/--70.png","name":"🔥 PACK FARM ระดับกลาง 499 บาท"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('gacha_items/1782512141107', '{"categoryId":"1782512057347","detail":"• บัตรฟาร์มออโต้ (งานรอบเมือง) 14 วัน พิเศษฟาร์มเก็บได้ไวขึ้น X2\n• บัตรฟาร์มออโต้ตกปลา Herring 14 วัน ฟาร์มตกปลาได้ไวขึ้น X2\n• สเต็กปลา (Steak Dorado) 20 ชิ้น\n• ไอศกรีมคลายร้อน 10 แท่ง\n• น้ำดื่มพลัส 10 ขวด\n• ผลไม้สกิลหิวช้า 3 ชิ้น\n• เบ็ดตกปลา LV7 (เช่า 7 วัน) ตกได้ทุกที่\n• พิเศษ! กล่องสุ่มแฟชั่น 2 กล่อง (สุ่มได้ 6 แบบ)","image":"https://img2.pic.in.th/--71.png","name":"👑 PACK FARM ระดับสูง 999 บาท"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('gacha_items/1782798905359', '{"categoryId":"1782174771670","detail":"","image":"https://img1.pic.in.th/images/--66ddca70d7234bde55.png","name":"Bp Twitter Thunder"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('gkey', '{"detail":"","image":"https://img2.pic.in.th/91619013584bf15aa.png"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('items/1781816597211', '{"image":"https://img2.pic.in.th/--76951bbcdb0af0edc.png","name":"Jade","source":"- คราฟได้ที่โต๊ะคราฟใน Rabel\n- ดรอปจากงัดร้าน\n- ติดต่อซื้อจากผู้เล่นภายในเมือง"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('items/1781819935416', '{"image":"https://img1.pic.in.th/images/--8673d90deb852f986.png","name":"Jade Scrap","source":"- ดรอปจากงานดำงัดบ้าน\n- ติดต่อซื้อจากผู้เล่นภายในเมือง"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('items/1783380158479', '{"image":"https://img2.pic.in.th/--9f5b98b71d40f6274.png","name":"Weapon Card","source":"- ดรอปจากงานดำงัดบ้าน\n- ดรอปจากงัดร้าน\n- ติดต่อซื้อจากผู้เล่นภายในเมือง"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('items/1783380319854', '{"image":"https://img2.pic.in.th/--11339b38d4318de80a.png","name":"Copper","source":"- เเปรรูปจากงานฟาร์มขุดเหมือง\n- ติดต่อซื้อจากผู้เล่นภายในเมือง"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('items/1783380597414', '{"image":"https://img2.pic.in.th/--12ed23e59c04bd75e0.png","name":"Gold","source":"- สุ่มดรอปจากงานเเปรรูปงานขุดเหมือง\n- ติดต่อซื้อจากผู้เล่นภายในเมือง"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('items/1783380738670', '{"image":"https://img2.pic.in.th/--130b3c73312ca2dd27.png","name":"Diamond Orange","source":"- สุ่มดรอปจากงานเเปรรูปงานขุดเหมือง\n- ติดต่อซื้อจากผู้เล่นภายในเมือง"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('items/1783380901014', '{"image":"https://img2.pic.in.th/--14edcb96ab123741b2.png","name":"Steel","source":"- งามฟาร์มเหล็ก"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('items/1783381018333', '{"image":"https://img1.pic.in.th/images/--15eb3704a8341739cb.png","name":"Steel Bar","source":"- เเปรรูปจากงานฟาร์มเหล็ก\n- ติดต่อซื้อจากผู้เล่นภายในเมือง"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('items/1783381205861', '{"image":"https://img2.pic.in.th/--16.png","name":"Steel High","source":"- สุ่มดรอปจากงานเเปรรูปงานฟาร์มเหล็ก\n- ติดต่อซื้อจากผู้เล่นภายในเมือง"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('items/1783381360645', '{"image":"https://img2.pic.in.th/--17a18aa5f278b811df.png","name":"Stone","source":"- งานฟาร์มขุดเหมือง"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('items/1783381671965', '{"image":"https://img2.pic.in.th/--19b6eb286896aa3e3f.png","name":"Semonite Fragment","source":"- งามฟาร์มเเร่ Semonite"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('items/1783381907750', '{"image":"https://img1.pic.in.th/images/--20170634381517a18a.png","name":"Semonite","source":"- เเปรรูปจากงานฟาร์มเเร่ Semonite\n- ติดต่อซื้อจากผู้เล่นภายในเมือง"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('items/1783382049262', '{"image":"https://img2.pic.in.th/--2175440e58437565cf.png","name":"Wood","source":"- งานฟาร์มงานตัดไม้\n- ติดต่อซื้อจากผู้เล่นภายในเมือง"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('items/1783382214077', '{"image":"https://img2.pic.in.th/--22a62ac86f8dddeaf9.png","name":"Lumber","source":"- เเปรรูปจากงานฟาร์มตัดไม้\n- ติดต่อซื้อจากผู้เล่นภายในเมือง"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('items/1783382351149', '{"image":"https://img2.pic.in.th/--2340aa948f0f8f172e.png","name":"Cement","source":"- ดรอปจากงานดำงานจกปูน\n- ติดต่อซื้อจากผู้เล่นภายในเมือง"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('items/1783382469916', '{"image":"https://img2.pic.in.th/--24b1b221e221ba6d39.png","name":"Wire","source":"- ดรอปจากงานดำงานจกสายไฟ\n- ติดต่อซื้อจากผู้เล่นภายในเมือง"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('items/1783382580422', '{"image":"https://img1.pic.in.th/images/--25e447ef00405aa981.png","name":"Vibranium","source":"- คราฟได้ที่โต๊ะคราฟใน Rabel\n- ติดต่อซื้อจากผู้เล่นภายในเมือง"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('items/1783382695190', '{"image":"https://img2.pic.in.th/--26b98ed2de61e6efd1.png","name":"Vibranium Shard","source":"- สุ่มดรอปจากงานตกปลาน้ำลึก"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('items/1783382860775', '{"image":"https://img2.pic.in.th/--270d9eae8f1007dc91.png","name":"Genesis Shard","source":"- งานดำจุดจกยา Genesis"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('items/1783382995764', '{"image":"https://img1.pic.in.th/images/--2895491eb14874f95d.png","name":"Aegis Shard","source":"- เเปรรูปจากงานดำจุดจกยา Genesis\n- ติดต่อซื้อจากผู้เล่นภายในเมือง"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('jobs/1781660011095', '{"difficulty":"ง่าย","howto":"","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/OAK01.png","isHot":true,"name":"งานปลากระป๋องรอบเมือง","requiredItems":["เบ็ดตกปลา L.V. 🎣 1 - 15"],"steps":[{"image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/fram00.png","text":"โดยของที่จะต้องเก็บเพื่อนำมาเเปรรูปเป็น ปลากระป๋อง คือ พริก มะเขือเทศ ปลา Herring"},{"image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/fram01.png","text":"รูปเเบบการฟาร์มของพริก เเละ มะเขือเทศ คือ การกดตัว E เพื่อเก็บผลผลิต สามารถย้ายมิติฟาร์มได้โดยการกดตัว F เเละยังใช้บัตรออโต้ฟาร์มได้อีกด้วย โดยจุดฟาร์ม พริก มะเขือเทศ จะอยู่ในรูปดังนี้"},{"image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/fram03.png","text":"รูปเเบบการฟาร์ม ใช้มินิเกมเบ็ดเลเวลคลิกเมาส์ หรือ กดตัว C เพื่อเลี้ยงปลาให้อยู่ในเกต จนหลอดด้านซ้ายเต็ม ข่าวดี ปัจจุบันสามารถใช้บัตรออโต้ตกปลาได้เเล้วนะ เเต่ บัตรออโต้ตกปลา จะเเยกกับบัตรออโต้ธรรมดา\nโดยจุดตกปลาจะอยู่ในรูปดังนี้"},{"image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/fram04.png","text":"ขั้นตอนสุดท้ายก่อนนำไปขายคือการเเปรรูป โดยจุดเเปรรูปในเเมพจะเป็นรูป ลูกศรสีเขียว จะมีด้วยกัน 2 จุดหลักๆ โดยหลังจากฟาร์มครบ 3 อย่างเเล้ว จะต้องนำมา เเปรรูปให้เสร็จก่อนที่จะนำไปขายที่จุดขาย Eco"},{"image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/fram05.png","text":"จุดขาย Eco ของฟาร์ม โดยจุดขาย Eco จะอยู่ในรูปดังนี้\nมีตู้เซฟลับที่สามารถเปิดท้ายรถได้โดยที่ไม่ต้องวิ่งไปไกลด้วยนะหาให้เจอละ อยู่ไม่ไกล"}],"type":"งานขาว"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('jobs/1781729784455', '{"difficulty":"ยากมาก","howto":"","image":"https://ik.imagekit.io/yw16pybm13/Job-oak2.png","isHot":true,"name":"งานเลี้ยงไข่ไดโนเสาร์🦖🦕","requiredItems":["ไม้ที่ยังไม่เเปรรูป🪵","กองไฟ 🔥","ไข่ไดโนเสาร์  🥚"],"steps":[{"image":"https://img2.pic.in.th/--104cd5d56d412f902e.png","text":"ของที่จำเป็นต้องมี\n-ไข่ไดโนเสาร์ หาจากกิจกรรมออนไลน์ กิจกรรมอื่นๆ\n- กองไฟ คราฟจากโต๊ะคราฟที่เลเบลใช้ไม้ที่ยังไม่เเปรรูป 10 ชิ้น\n- ไม้ที่ยังไม่เเปรรูป หาจากงานฟาร์มตัดไม้"},{"image":"https://img2.pic.in.th/--113e65194fe6024640.png","text":"หาจุดวางกองไฟโดยจุดที่วางได้วงกลมใต้กองไฟจะเป็นจุดสีฟ้า กดคลิกซ้ายเพื่อวางโดยเมื่อวางกองไฟไปเเล้วสิ่งที่ต้องระวังคือห้ามปล่อยกองไฟดับ โดยให้สังเกต หลอดน้ำมันบนกองไฟห้ามปล่อยให้ลดลงจนเหลือ 0 เด็ดขาด วิธีเติมเชื้อเพลิงให้ใช้ไม้ที่ยังไม่เเปรรูปกด E เพื่อเติม"},{"image":"https://img2.pic.in.th/--121833b6fc10088f88.png","text":"วางไข่ให้อยู่ในระยะวงของกองไฟเพื่อให้ไข่ได้รับความอบอุ่น เพราะถ้าไข่ขาดความอบอุ่นไข่ก็จะหายไป โดยวิธีดูหลอดอุณหภูมิของไข่ให้สังเกตหลอดตามในรูปนี้ เลขอุณหภูมิจะต้องเต็ม 100% ตลอดเวลา"},{"image":"https://img2.pic.in.th/--131fad4d2252facd60.png","text":"โดยสิ่งที่สำคัญที่สุดอีกอย่างที่จะช่วยให้ไข่ของคุณไม่หายไปคือหลอดค่าความสะอาดของไข่ โดยต้องระวังไม่ให้หลอดค่าความสะอาดของไข่สูงจนเต็ม 100% เพราะถ้าสูงจนเต็มไข่ก็จะหายไป โดยวิธีทำความสะอาดให้คุณกดตัว G เพื่อทำความสะอาดโดยสามารถกดได้เมื่อค่าความสกปรกสูงเกิน 25% สำคัญมากอย่าปล่อยให้ไข่สกปรกน้า โดยหลอดค่าความสะอาดของไข่จะมีลักษณะตามในรูปดังนี้"},{"image":"https://img2.pic.in.th/--14ccb93ce553ab6e42.png","text":"นี่คือระยะเวลาในการฟักไข่เมื่อเวลาลดลงจนเหลือ 0 ให้กด E เพื่อฟักไข่ หากกดฟักไม่ได้ให้กดตัว G เพื่อรีเซ็ตโดยเมื่อฟักไข่ไดโนเสาร์เป็นตัวเเล้วจะมีเวลาบนตัวไดโนเสาร์ให้รีบนำไดโนเสาร์ไปขายก่อนเวลาหมดไม่งั้น น้องจะตุย"},{"image":"https://img2.pic.in.th/--15eb70d1a6c0ca1a2f.png","text":"จุดขาย ปัจจุบันอยู่ตรงเเลนคาสิโนหลังโต๊ะบาโดยให้อุ้มไดโนเสาร์มาขายทีละตัวโดยกดตัว E จากนั้นกดตัว G เพื่อขาย\n- ปัจจุบันยังสามารถเลี้ยงได้ทุกที่ที่วางกองไฟได้ ยกเว้นสถานที่ราชการที่หวงห้ามต่างๆ\n- ยังไม่มีการเปิดการปล้นไดโนเสาร์อีกด้วย"}],"type":"งานขาว"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('jobs/1781739671834', '{"difficulty":"ง่าย","howto":"เลี้ยงหมูจนโต ลุ้นสุ่มกลายพันธุ์ 5 สายพันธุ์ ระหว่างรอสามารถพูดคุยหรือทำ Roleplay ได้ เหมาะสำหรับผู้เล่นใหม่ที่ต้องการตั้งตัว","image":"https://ik.imagekit.io/yw16pybm13/OAK03.png","isHot":true,"name":"งานเลี้ยงหมู 🐽🐷","requiredItems":["หมู 🐷","อาหารหมู 🥬"],"steps":[{"image":"https://img2.pic.in.th/--503cf9b26d2af2d676.png","text":"โดยจุดงานฟาร์มเลี้ยงหมูจะมีลักษณะดังนี้"},{"image":"https://img2.pic.in.th/--51.png","text":"ITEMS ที่ต้องใช้ในการฟาร์มเลี้ยงหมูมีหลักๆ 2 อย่างคือ หมู อาหารหมู โดยสามารถหาซื้อได้ที่จุดงานฟาร์มเลี้ยงหมูเลย"},{"image":"https://img2.pic.in.th/--72.png","text":"กด K เลือกมิติที่จะเข้าไปเลี้ยง กดปล่อยเเล้วคอยให้อาหารหมูเมื่อหิว ให้อาหารด้วยการกดตัว E ที่หมู โดยให้สังเกตหลอด Stack ด้านซ้ายหากเลขค่าความหิวครบ 100 ให้รีบให้อาหารหมูทันที\nเมื่อเลี้ยงหมูให้อาหารจนโต หมูจะมีโอกาศกลายพันธุ์ มี 5 สายพันธุ์ เเละ หมูจะดรอบเนื้อเกรดที่ต่างกัน ( ราคาจะต่างกันด้วย )"},{"image":"https://img2.pic.in.th/--73.png","text":"จุดขายหมู จะอยู่โซนใกล้ๆคุก กับ Rabel บน โดยราคาเนื้อหมูจะมีการผันผวนตามการปรับ Buff Nerf ราคาของเมือง"}],"type":"งานขาว"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('jobs/1782061345567', '{"difficulty":"ปานกลาง","howto":"","image":"https://ik.imagekit.io/yw16pybm13/OAK04.png","isHot":false,"name":"ตกไวเบ","requiredItems":["เรือ ⛵","เบ็ดตกปลา L.V. 🎣 1 - 15"],"steps":[{"image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/viba1.png","text":"หลังจากซื้อเรือที่จุดซื้อเรือมาเเล้ว ให้ขับเรือไปที่จุดตกปลาน้ำลึกในเเมพ เมื่อขับเรือมาถึงจุดตกปลาน้ำลึกเเล้วให้ทิ้งสมอเรือด้วยการกดตัว K จากนั้นกดใช้ เบ็ดที่มีอยู่ในตัว Minigame จะเหมือนกับตกปลาเบ็ดเลเวล คือการกดคลิกซ้าย หรือ ตัว C เพื่อเลี้ยงปลาให้อยู่ในเกตจนหลอดด้านซ้ายเต็ม"},{"image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/viba2.png","text":"NEW MINIGAME!!! ( หากเล่นสำเร็จจะได้เศษไวเบ )\nเมื่อตกเเล้วมีกล่องสมบัติขึ้นมาในหลอดปลาให้รีบกดขึ้นไปเลี้ยงเพื่อเก็บกล่องสมบัติก่อนจะสังเกตได้ว่าตอนเรากำลังเลี้ยงเก็บกล่องสมบัติหลอดเวลาทางขวาสุดจะไม่ลด \nเมื่อเก็บกล่องสมบัติเสร็จเเล้วให้รีบกลับมาเก็บปลาในหลอดตามเดิม"},{"image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/viba3.png","text":"เมื่อตกปลาน้ำลึกเสร็จเเล้ว ให้นำปลาไปขายที่จุดรับซื้อปลาใกล้ๆเเลนเขียวตามในรูป ส่วนเศษไวเบ ให้นำไปตีได้ที่โต๊ะใน Rabel โต๊ะทั่วไปได้เลยครับ"}],"type":"งานขาว"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('jobs/1782075506315', '{"difficulty":"ง่าย","howto":"","image":"https://ik.imagekit.io/yw16pybm13/OAK05.png","isHot":false,"name":"งานฟาร์มเหล็ก","type":"งานขาว"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('jobs/1782075576675', '{"difficulty":"ง่าย","howto":"","image":"https://ik.imagekit.io/yw16pybm13/OAK06.png","isHot":false,"name":"งานฟาร์มเหมือง","type":"งานขาว"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('jobs/1782077094810', '{"difficulty":"ยาก","howto":"","image":"https://ik.imagekit.io/yw16pybm13/OAK07.png","isHot":false,"name":"งานฟาร์มเเร่ Semonite","type":"งานขาว"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('jobs/1787617257168', '{"difficulty":"ยาก","howto":"","image":"https://ik.imagekit.io/yw16pybm13/OAK09.png","isHot":false,"name":"งานฟาร์มดำน้ำ","type":"งานขาว"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('jobs/1787617302769', '{"difficulty":"ยาก","howto":"","image":"https://ik.imagekit.io/yw16pybm13/OAK08.png","isHot":false,"name":"งานฟาร์มตัดไม้","type":"งานขาว"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('jobs/1788657053367', '{"difficulty":"ยาก","howto":"","image":"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/fishrod2.png","isHot":true,"name":"งานตกปลาเบ็ดเลเวล","type":"งานขาว"}'::jsonb)
    on conflict (path) do update set value = excluded.value;
insert into public.nodes (path, value) values ('site_config/cutscene_logo', '"https://cdn.jsdelivr.net/gh/JosephNovax2/SUMMER@main/cutscene-logo.png"'::jsonb)
    on conflict (path) do update set value = excluded.value;
commit;
