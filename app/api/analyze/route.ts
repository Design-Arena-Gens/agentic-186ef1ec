import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { content } = await request.json()

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: 'Invalid content' }, { status: 400 })
    }

    const result = analyzeContent(content)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}

function analyzeContent(content: string) {
  // Email regex
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
  const emails = Array.from(new Set(content.match(emailRegex) || []))

  // Discord handles (username#1234 or @username or discord.gg/invite)
  const discordRegex = /(?:@?([A-Za-z0-9_]{2,32}#\d{4})|discord\.gg\/[A-Za-z0-9]+|discordapp\.com\/(?:invite|users)\/[A-Za-z0-9]+|@[A-Za-z0-9_]{2,32}(?=\s|$))/g
  const discordMatches = content.match(discordRegex) || []
  const discord = Array.from(new Set(discordMatches))

  // Social media patterns
  const socialMedia = {
    twitter: extractUrls(content, [
      /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/[A-Za-z0-9_]+/g,
      /@([A-Za-z0-9_]{1,15})(?=\s|$)/g
    ]).map(url => normalizeUrl(url, 'twitter.com')),

    facebook: extractUrls(content, [
      /(?:https?:\/\/)?(?:www\.)?facebook\.com\/[A-Za-z0-9.]+/g,
      /(?:https?:\/\/)?(?:www\.)?fb\.com\/[A-Za-z0-9.]+/g
    ]).map(url => normalizeUrl(url, 'facebook.com')),

    instagram: extractUrls(content, [
      /(?:https?:\/\/)?(?:www\.)?instagram\.com\/[A-Za-z0-9._]+/g
    ]).map(url => normalizeUrl(url, 'instagram.com')),

    linkedin: extractUrls(content, [
      /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in|company)\/[A-Za-z0-9-]+/g
    ]).map(url => normalizeUrl(url, 'linkedin.com')),

    youtube: extractUrls(content, [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:c\/|channel\/|user\/|@)?[A-Za-z0-9_-]+/g,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/[A-Za-z0-9_-]+/g
    ]).map(url => normalizeUrl(url, 'youtube.com')),

    tiktok: extractUrls(content, [
      /(?:https?:\/\/)?(?:www\.)?tiktok\.com\/@[A-Za-z0-9._]+/g
    ]).map(url => normalizeUrl(url, 'tiktok.com')),

    github: extractUrls(content, [
      /(?:https?:\/\/)?(?:www\.)?github\.com\/[A-Za-z0-9_-]+/g
    ]).map(url => normalizeUrl(url, 'github.com'))
  }

  return {
    emails,
    discord,
    socialMedia
  }
}

function extractUrls(content: string, patterns: RegExp[]): string[] {
  const urls = new Set<string>()

  for (const pattern of patterns) {
    const matches = content.match(pattern) || []
    matches.forEach(match => urls.add(match))
  }

  return Array.from(urls)
}

function normalizeUrl(url: string, domain: string): string {
  // Add https:// if no protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url
  }

  // Ensure www is consistent
  try {
    const urlObj = new URL(url)
    if (!urlObj.hostname.startsWith('www.') && !urlObj.hostname.includes('youtu.be')) {
      urlObj.hostname = 'www.' + urlObj.hostname
    }
    return urlObj.toString()
  } catch {
    return url
  }
}
