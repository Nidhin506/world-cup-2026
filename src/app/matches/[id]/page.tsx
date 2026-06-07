import React from 'react';
import MatchCenterClient from './MatchCenterClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MatchDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <MatchCenterClient id={resolvedParams.id} />;
}
