import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.MONGODB_URL;

export default async function handler(req, res) {
  const client = new MongoClient(uri)

  try {
    await client.connect()

    const collection = client.db('test').collection('users')

    switch (req.method) {
      case 'GET':
        const users = await collection.find().toArray();

        // Fetch increments and decrements for each user
        const usersWithPoints = await Promise.all(
          users.map(async (user) => {
            const increments = await collection
              .find({
                _id: user._id,
                'balance.timestamp': {
                  $gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
                },
              })
              .project({ 'balance.amount': 1 })
              .toArray();

            const totalBalanceChange = increments.reduce(
              (sum, increment) => sum + increment.balance.amount,
              0
            );

            const winningPoints = totalBalanceChange;
            const commissionPoints = 0.05 * totalBalanceChange;

            return { ...user, winningPoints, commissionPoints };
          })
        );

        res.status(200).json(usersWithPoints);
        break;
      case 'PUT':
        const { id } = req.query
        const { userName, role } = req.body
        await collection.updateOne(
          { _id: ObjectId(id) },
          { $set: { userName: userName, role: role } }
        )
        res.status(200).json({ message: 'User updated successfully' })
        break
      case 'DELETE':
        const userId = req.query.id
        await collection.deleteOne({ _id: ObjectId(userId) })
        res.status(200).json({ message: 'User deleted successfully' })
        break
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal Server Error' })
  } finally {
    await client.close()
  }
}
