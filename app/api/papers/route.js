import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Paper from '@/models/Paper';

// Save paper metadata to database
export async function POST(req) {
  try {
    await dbConnect();

    const { userId, fileName, fileSize } = await req.json();

    if (!userId || !fileName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const paper = await Paper.create({
      userId,
      fileName,
      fileSize: fileSize || 0,
    });

    return NextResponse.json({
      success: true,
      paper: {
        id: paper._id,
        fileName: paper.fileName,
        uploadedAt: paper.uploadedAt,
      },
    });
  } catch (error) {
    console.error('Paper save error:', error);
    return NextResponse.json(
      { error: 'Failed to save paper metadata' },
      { status: 500 }
    );
  }
}

// Get user's papers
export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    const papers = await Paper.find({ userId })
      .sort({ uploadedAt: -1 })
      .limit(10);

    return NextResponse.json({
      success: true,
      papers: papers.map(p => ({
        id: p._id,
        fileName: p.fileName,
        uploadedAt: p.uploadedAt,
        elifCount: p.elifCount,
        scholarSightCount: p.scholarSightCount,
        chatMessageCount: p.chatMessageCount,
        lastAccessed: p.lastAccessed,
      })),
    });
  } catch (error) {
    console.error('Fetch papers error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch papers' },
      { status: 500 }
    );
  }
}

// Delete a paper
export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const paperId = searchParams.get('paperId');
    if (!paperId) {
      return NextResponse.json({ error: 'Paper ID required' }, { status: 400 });
    }
    await Paper.findByIdAndDelete(paperId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete paper error:', error);
    return NextResponse.json({ error: 'Failed to delete paper' }, { status: 500 });
  }
}

// Update paper analysis counts
export async function PATCH(req) {
  try {
    await dbConnect();

    const { paperId, analysisType } = await req.json();

    if (!paperId || !analysisType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const updateField = {};
    switch (analysisType) {
      case 'elif':
        updateField.elifCount = 1;
        break;
      case 'scholarsight':
        updateField.scholarSightCount = 1;
        break;
      case 'chat':
        updateField.chatMessageCount = 1;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid analysis type' },
          { status: 400 }
        );
    }

    updateField.lastAccessed = new Date();

    const paper = await Paper.findByIdAndUpdate(
      paperId,
      { $inc: updateField },
      { new: true }
    );

    if (!paper) {
      return NextResponse.json(
        { error: 'Paper not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      paper: {
        id: paper._id,
        elifCount: paper.elifCount,
        scholarSightCount: paper.scholarSightCount,
        chatMessageCount: paper.chatMessageCount,
      },
    });
  } catch (error) {
    console.error('Update paper error:', error);
    return NextResponse.json(
      { error: 'Failed to update paper' },
      { status: 500 }
    );
  }
}
