export default async (req, res) => {
    console.log(req.query)
    res.status(200).json({ name: 'John Doe' })
}