import { Search } from "lucide-react"

interface SearchProps {
    searchTerm: string; 
    setSearchTerm: (term: string) => void;
}
function SearchComponent({ searchTerm, setSearchTerm }: SearchProps) {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
                type="text"
                placeholder="Tìm kiếm theo tác giả hoặc nội dung..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>
    )
}

export default SearchComponent