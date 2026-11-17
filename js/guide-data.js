// গাইডবইয়ের লেখা — প্রতিটি গল্পের (ইউনিটের) জন্য আলাদা। পরে আসল বইয়ের লেখা এখানে বসবে।
// গঠন: GUIDES[গল্পের ক্রম] = { tag: ছোট নীল লেবেল, sections: [ { h: শিরোনাম, p: [অনুচ্ছেদ, ...] } ] } — তিন ভাষার জন্য [বাংলা, English, العربية]
// নিচের লেখাগুলো শুধু নমুনা (যাতে পেইজের চেহারা দেখা যায়)।
export const GUIDES = [
  {
    tag: ['সূচনা', 'Introduction', 'مقدمة'],
    sections: [
      { h: ['এই গল্পে কী শিখবেন', 'What you will learn in this story', 'ماذا ستتعلم في هذه القصة'], p: [['এখানে গল্পটির মূল বিষয় সংক্ষেপে লেখা থাকবে। (নমুনা লেখা)', 'A short summary of the story will appear here. (sample text)', 'سيظهر هنا ملخص قصير للقصة. (نص تجريبي)']] },
      { h: ['সংজ্ঞা', 'Definitions', 'التعريفات'], p: [['যে শব্দ বা বিষয়ের সংজ্ঞা প্রশ্নে এসেছে, সেটি এখানে সহজ ভাষায় লেখা থাকবে। (নমুনা লেখা)', 'Definitions of the terms used in the questions will be written here in simple words. (sample text)', 'ستُكتب هنا تعريفات المصطلحات الواردة في الأسئلة بلغة بسيطة. (نص تجريبي)']] },
      { h: ['গল্প ও অনুচ্ছেদ', 'Story and passage', 'القصة والفقرة'], p: [['বই থেকে যে গল্প বা অনুচ্ছেদ থেকে প্রশ্ন বানানো হয়েছে, পুরো লেখাটি এখানে থাকবে। (নমুনা লেখা)', 'The full story or passage the questions were made from will be shown here. (sample text)', 'سيظهر هنا النص الكامل للقصة أو الفقرة التي صيغت منها الأسئلة. (نص تجريبي)']] }
    ]
  }
];
export const guideFor = (i) => GUIDES[i] || GUIDES[0];
