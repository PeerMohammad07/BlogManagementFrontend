import { Search } from 'lucide-react'

const Footer = () => {
  return (
    <>
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">Category</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-orange-500">Design</a></li>
                <li><a href="#" className="hover:text-orange-500">Development</a></li>
                <li><a href="#" className="hover:text-orange-500">Marketing</a></li>
                <li><a href="#" className="hover:text-orange-500">Business</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Author</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-orange-500">Team</a></li>
                <li><a href="#" className="hover:text-orange-500">Join us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-orange-500">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-orange-500">Terms of Use</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Subscribe for updates</h3>
              <div className="flex">
                <input type="email" placeholder="Your email" className="bg-gray-800 text-white px-4 py-2 rounded-l-full w-full" />
                <button className="bg-orange-500 text-white px-4 py-2 rounded-r-full">
                  <Search size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
