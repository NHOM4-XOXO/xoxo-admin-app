import { Select } from "antd";

const { Option } = Select;

interface RoleFilterDropdownProps {
    filter: string;
    setFilter: (value: string) => void;
    optionList: {value:string, label:string}[];
}

export default function FilterDropdown({ optionList, filter, setFilter }: RoleFilterDropdownProps) {
    return (
        <Select
            value={filter}
            onChange={(value) => setFilter(value)}
            placeholder="Chọn vai trò"
            style={{ width: '100%', height: '100%', marginBottom: '10px' }}
        >
            {
                optionList.map((option) => {
                    return <Option key={option.value} value={option.value}>{option.label}</Option>
                })
            }
        </Select>
    );
}
