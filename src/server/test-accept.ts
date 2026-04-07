import { prisma } from './prisma.js'

async function testAcceptApi() {
  console.log('--- Testing Friend Request Acceptance ---')
  
  // 1. Find the users involved (from logs: best and sss)
  const best = await prisma.user.findUnique({ where: { username: 'best' } })
  const sss = await prisma.user.findUnique({ where: { username: 'sss' } })
  
  if (!best || !sss) {
    console.error('Users not found!')
    return
  }

  console.log(`Requester (sss): ${sss.id}`)
  console.log(`Recipient (best): ${best.id}`)

  // 2. Check if a request exists from sss to best
  let followRequest = await prisma.follows.findUnique({
    where: {
      followerId_followingId: {
        followerId: sss.id,
        followingId: best.id
      }
    }
  })

  if (!followRequest) {
    console.log('No pending request found from sss to best. Creating one...')
    followRequest = await prisma.follows.create({
      data: {
        followerId: sss.id,
        followingId: best.id,
        status: 'PENDING'
      }
    })
    console.log('Created request:', followRequest)
  } else {
    console.log('Existing request found:', followRequest)
  }

  // 3. Attempt to Accept (simulate best accepting sss)
  console.log('\n--- Attempting to Accept ---')
  try {
    const updated = await prisma.follows.update({
      where: {
        followerId_followingId: {
          followerId: sss.id,
          followingId: best.id
        }
      },
      data: {
        status: 'ACCEPTED'
      }
    })
    console.log('Update Successful:', updated)
  } catch (error) {
    console.error('Update Failed:', error)
  }

  // 4. Verify
  const verified = await prisma.follows.findUnique({
    where: {
      followerId_followingId: {
        followerId: sss.id,
        followingId: best.id
      }
    }
  })
  console.log('\nFinal Verification State:', verified)
  
  await prisma.$disconnect()
}

testAcceptApi()
