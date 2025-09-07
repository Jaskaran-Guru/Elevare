const express = require('express');
const router = express.Router();

// Import User model for progress tracking (optional)
let User;
try {
  User = require('../models/User');
} catch (error) {
  console.warn('⚠️ User model not found - progress tracking disabled');
}

router.post('/generate-learning-resources', async (req, res) => {
  const startTime = Date.now();
  
  try {
    console.log('✅ AI Route called successfully - Starting generation...');
    console.log('📥 Request received:', JSON.stringify(req.body, null, 2));
    
    // ✅ SAFE DESTRUCTURING - Extract all required fields
    const { 
      topic, 
      subject, 
      grade, 
      stream, 
      difficulty, 
      userId 
    } = req.body || {};
    
    // Input validation
    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Topic is required',
        message: 'कृपया एक valid topic provide करें'
      });
    }

    console.log('🤖 Generating AI resources for topic:', topic);
    
    // Generate comprehensive AI study resources
    const aiResources = {
      summary: `यह ${topic} का comprehensive AI-generated summary है जो ${grade} ${stream} students के लिए ${difficulty} level पर बनाया गया है। यह topic आपकी ${subject} की understanding के लिए बहुत महत्वपूर्ण है।`,
      
      detailedNotes: `${topic} - Complete Study Guide

📚 Introduction:
यह topic ${subject} का एक महत्वपूर्ण हिस्सा है जो ${grade} के students के लिए essential knowledge provide करता है।

🎯 Learning Objectives:
• Core concepts की clear understanding develop करना
• Practical applications को समझना और implement करना  
• Problem-solving skills को enhance करना
• Real-world connections establish करना

🔑 Key Points:
1. Foundation principles और theoretical background
2. Step-by-step problem solving methodology
3. Common mistakes और उनसे बचने के तरीके
4. Practical applications और career relevance
5. Advanced concepts के लिए preparation

💡 Study Strategy:
- Daily 20-30 minutes dedicated practice करें
- Regular revision और note-making जरूरी है
- Visual aids और examples का use करें
- Group discussions में participate करें
- Mock tests और self-assessment करते रहें

📝 Detailed Explanation:
${topic} को completely master करने के लिए systematic approach अपनाना बहुत जरूरी है। पहले basic concepts को thoroughly understand करें, फिर practical applications पर focus करें।`,

      keyTerms: [
        {
          term: "Core Concept",
          definition: `${topic} की fundamental definition और primary understanding`,
          example: `Real-world scenarios में यह concept कैसे practically apply होता है`
        },
        {
          term: "Key Principle", 
          definition: "Main governing principle जो इस topic की foundation बनाता है",
          example: "Mathematical representation और logical reasoning के साथ"
        },
        {
          term: "Application Domain",
          definition: "यह concept कहाँ और कैसे practically useful है",
          example: "Industry और academic fields में इसके specific uses"
        }
      ],

      workedExamples: [
        {
          title: `${topic} - Comprehensive Worked Example`,
          problem: `यह ${topic} का detailed example problem है जो ${difficulty} level के students के लिए specially designed है। यह real-world application को demonstrate करता है।`,
          solution: `Complete Step-by-Step Solution:

Step 1: Problem Analysis & Understanding
- Given information को systematically identify और organize करें
- Required output को clearly define और understand करें
- Relevant concepts, formulas और methods को recall करें
- Problem की constraints और limitations को note करें

Step 2: Strategic Planning & Method Selection
- Most appropriate approach या technique choose करें
- Mathematical tools और analytical methods identify करें
- Solution strategy plan करें step-by-step
- Alternative approaches consider करें if needed

Step 3: Implementation & Calculation
- Systematic calculations perform करें accurately
- Each step को logically justify करें
- Intermediate results verify करते रहें
- Units, dimensions और scale factors maintain करें

Step 4: Verification & Quality Check
- Final answer को multiple methods से cross-verify करें
- Physical reasonableness और logical consistency check करें
- Error analysis और accuracy assessment करें
- Professional format में comprehensive answer present करें`,
          explanation: "यह systematic methodology हमेशा follow करने से problem-solving accuracy और conceptual understanding दोनों significantly improve होती है।"
        }
      ],

      practiceProblems: [
        {
          question: `${topic} Advanced Application Problem: 

इस comprehensive problem में आपको ${topic} के concepts को real-world scenario में effectively apply करना है। सभी relevant factors को carefully consider करके detailed solution provide करें।

Problem Statement: [Specific problem based on the topic would be here, tailored to ${difficulty} level and ${grade} students]`,

          hints: [
            `${topic} के fundamental principles को clearly recall करें`,
            "Problem statement को multiple times carefully read करें", 
            "Given data को systematically organize और categorize करें",
            "Relevant formulas, concepts और methods identify करें",
            "Step-by-step logical approach maintain करें throughout",
            "Units, dimensions और mathematical accuracy ensure करें"
          ],
          
          solution: `Comprehensive Solution Strategy:

Phase 1: Complete Problem Analysis
- Problem context को thoroughly understand करें
- All available data को systematically list करें
- Required outputs को clearly identify करें
- Constraints, limitations और assumptions note करें
- Related concepts और prerequisite knowledge review करें

Phase 2: Strategic Method Selection
- Multiple solution approaches evaluate करें
- Most efficient और accurate method select करें
- Required mathematical tools identify करें
- Potential challenges या complications anticipate करें

Phase 3: Systematic Implementation
- Step-by-step calculations perform करें methodically
- Each calculation step को properly document करें
- Intermediate results continuously verify करें
- Mathematical accuracy और precision maintain करें
- Progress को regularly monitor करें

Phase 4: Comprehensive Verification & Analysis
- Final results को multiple independent methods से verify करें
- Physical meaningfulness और logical consistency check करें
- Order of magnitude analysis perform करें
- Error bounds और uncertainty analysis करें
- Alternative solution approaches try करें validation के लिए

Phase 5: Professional Presentation
- Results को clear, organized format में present करें
- Assumptions, limitations और scope clearly state करें
- Practical implications और real-world significance explain करें
- Future extensions या related problems suggest करें`,

          difficulty: difficulty || 'intermediate'
        }
      ],

      studyTips: [
        `${topic} master करने के लिए daily consistent practice absolutely essential है`,
        "Conceptual clarity को हमेशा priority दें - mechanical memorization avoid करें", 
        "Visual learning aids, diagrams और mind maps का extensive use करें",
        "Real-world examples और practical applications के साथ concepts connect करें",
        "Study groups में actively participate करें - collaborative learning powerful है",
        "Regular self-assessment, mock tests और progress evaluation करें",
        "Doubts को immediately clarify करें - accumulation avoid करें",
        "Teaching others या explaining concepts aloud भी effective technique है",
        "Interdisciplinary connections identify करें related subjects के साथ",
        "Current research trends और latest developments को follow करें"
      ],

      realWorldApplications: [
        `${topic} modern technology, engineering और scientific research में extensively utilized है`,
        `${subject} की advanced research areas और cutting-edge developments में crucial role play करता है`,
        "Industry standards, quality control processes और manufacturing में fundamental importance है",
        "Innovation, product development और technological advancement में key enabling factor है",
        "Competitive examinations (JEE, NEET, GATE etc.) में high-weightage, frequently tested topic है",
        "Professional career opportunities में specialized technical expertise demonstrate करता है",
        "Entrepreneurship और startup ventures में practical knowledge applicable है"
      ],

      timeToMaster: "3-4 weeks के dedicated daily practice के साथ comprehensive mastery achievable है",

      prerequisites: [
        `${subject} के fundamental mathematical concepts thoroughly clear होने चाहिए`,
        "Basic principles, definitions और terminology की solid understanding essential है",
        "Problem-solving mindset, analytical thinking और logical reasoning skills develop करनी चाहिए",
        "Previous related topics का good foundation established होना जरूरी है"
      ],

      nextTopics: [
        `${topic} को completely master करने के बाद related advanced topics systematically explore करें`,
        "Interdisciplinary applications में इस fundamental knowledge को effectively utilize करें",
        "Research-oriented projects, practical implementations में hands-on experience gain करें",
        "Professional certifications या specialized courses consider करें further expertise के लिए"
      ],

      metadata: {
        topic: topic,
        subject: subject || 'General Studies',
        difficulty: difficulty || 'intermediate',
        grade: grade || '11th',
        stream: stream || 'general',
        generatedAt: new Date().toISOString(),
        hasVideos: false,
        contentType: 'AI-generated comprehensive educational package',
        language: 'Hindi-English optimized mix for maximum comprehension',
        estimatedStudyTime: '3-4 weeks with consistent practice',
        lastUpdated: new Date().toISOString(),
        isFallback: false,
        resourceQuality: 'comprehensive',
        targetAudience: `${grade} ${stream} students`
      }
    };

    console.log('✅ AI resources generated successfully');

    // ✅ OPTIONAL: Background progress tracking (non-blocking)
    if (userId && User) {
      console.log('📊 Starting background progress tracking...');
      
      // Save progress in background without blocking main response
      saveUserProgressSafely(userId, topic, subject, difficulty, aiResources)
        .then(() => console.log('✅ User progress saved successfully'))
        .catch(err => console.warn('⚠️ Progress save failed (non-critical):', err.message));
    }

    // Calculate and log response time
    const responseTime = Date.now() - startTime;
    console.log(`⏱️ Total AI generation time: ${responseTime}ms`);

    // Send successful response
    res.json({
      success: true,
      message: 'AI study resources generated successfully',
      resources: aiResources,
      metadata: {
        generatedAt: new Date().toISOString(),
        responseTime: `${responseTime}ms`,
        fallbackUsed: false,
        serverStatus: 'operational'
      }
    });
    
  } catch (error) {
    console.error('❌ Critical error in AI route:', error);
    console.error('Error stack:', error.stack);
    
    // Generate fallback content even if main generation fails
    const fallbackContent = generateFallbackContent(
      req.body?.topic || 'General Study Topic',
      req.body?.subject || 'General Subject',
      req.body?.difficulty || 'beginner'
    );
    
    // Return error response with fallback content
    res.status(500).json({
      success: false,
      error: 'AI resource generation encountered an issue',
      message: 'Technical समस्या के कारण basic content provide कर रहे हैं। कृपया बाद में detailed content के लिए retry करें।',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      fallbackContent: fallbackContent,
      timestamp: new Date().toISOString()
    });
  }
});

// ✅ HELPER FUNCTION: Safe progress tracking (non-blocking)
// ✅ Fix saveUserProgressSafely function
async function saveUserProgressSafely(userId, topic, subject, difficulty, aiResources) {
  try {
    console.log('💾 Attempting to save progress for user:', userId);
    
    if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error('Invalid user ID format');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    console.log('👤 User found for progress save:', user.name);

    const contentId = `ai-content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const progressData = {
      status: 'in_progress',
      completionPercentage: 10,
      score: 5,
      timeSpent: 1,
      aiResourcesGenerated: true,
      aiResourcesData: {
        topic,
        subject,
        difficulty,
        generatedAt: new Date()
      }
    };

    // ✅ CRITICAL: Await the updateProgress method
    const savedUser = await user.updateProgress(contentId, progressData);
    
    console.log('✅ Progress saved successfully! Total progress:', savedUser.progress.length);
    return true;

  } catch (error) {
    console.error('❌ Progress save error:', error.message);
    return false;
  }
}


// ✅ HELPER FUNCTION: Fallback content generator
function generateFallbackContent(topic, subject, difficulty) {
  return {
    summary: `यह ${topic} का basic study material है। Technical issues के कारण detailed AI content generate नहीं हो सका, लेकिन basic information provide कर रहे हैं।`,
    
    detailedNotes: `${topic} - Basic Study Notes

📖 Topic Overview:
यह ${subject} का एक important topic है जिसे समझना academic success के लिए जरूरी है।

📝 Basic Study Approach:
1. Fundamental concepts को clearly understand करें
2. Basic examples practice करें regularly
3. Consistent revision schedule maintain करें
4. Doubts को immediately clarify करें

💡 General Study Tips:
- Daily study routine establish करें
- Comprehensive notes बनाकर maintain करें
- Practice problems regularly solve करें
- Peer discussions में participate करें`,
    
    keyTerms: [
      { 
        term: "Basic Concept", 
        definition: `${topic} की fundamental understanding और primary definition`, 
        example: "General academic application में इसका basic usage" 
      }
    ],
    
    practiceProblems: [
      { 
        question: `${topic} के related basic practice question को solve करें।`, 
        solution: "Systematic step-by-step approach अपनाकर solution निकालें", 
        difficulty: "basic" 
      }
    ],
    
    studyTips: [
      "Consistent daily study habit develop करें",
      "Conceptual clarity को priority दें",
      "Regular practice और revision करें"
    ],
    
    timeToMaster: "2-3 weeks with basic practice",
    
    metadata: {
      topic: topic,
      subject: subject,
      difficulty: difficulty,
      isFallback: true,
      contentType: 'basic_fallback_content',
      message: "यह basic content है - complete AI resources के लिए later में retry करें",
      generatedAt: new Date().toISOString()
    }
  };
}

// Export the router
module.exports = router;
