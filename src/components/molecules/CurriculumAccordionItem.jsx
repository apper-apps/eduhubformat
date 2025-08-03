import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { cn } from '@/utils/cn'
import ApperIcon from '@/components/ApperIcon'

function CurriculumAccordionItem({ item, index, curriculum, onRemove, onDragEnd }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleAccordion = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={toggleAccordion}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 flex-1 text-left">
          <ApperIcon 
            name={isOpen ? "ChevronDown" : "ChevronRight"} 
            size={16} 
            className="text-gray-400 transition-transform duration-200"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {item.title}
            </h4>
            {item.videoUrl && (
              <p className="text-xs text-gray-500 truncate mt-1">
                {item.videoUrl}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
            레슨 {index + 1}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemove(item.id)
            }}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-all opacity-0 group-hover:opacity-100"
            title="삭제"
          >
            <ApperIcon name="Trash2" size={16} />
          </button>
        </div>
      </button>

      {/* Accordion Content */}
      <div 
        className={cn(
          "accordion-content",
          isOpen ? "accordion-open" : "accordion-closed"
        )}
      >
        <div className="p-4 pt-0 border-t border-gray-100">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="curriculum">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          'flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg group hover:shadow-md transition-all',
                          snapshot.isDragging && 'shadow-lg bg-white'
                        )}
                      >
                        <div
                          {...provided.dragHandleProps}
                          className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                        >
                          <ApperIcon name="GripVertical" size={16} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <ApperIcon name="Play" size={14} className="text-primary-600" />
                            <span className="text-xs text-gray-600 font-medium">동영상 강의</span>
                          </div>
                          <h5 className="text-sm font-medium text-gray-900 mb-1">
                            {item.title}
                          </h5>
                          {item.videoUrl && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <ApperIcon name="Link" size={12} />
                              <span className="truncate">{item.videoUrl}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded border">
                            {Math.floor(Math.random() * 20) + 5}분
                          </span>
                        </div>
                      </div>
                    )}
                  </Draggable>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  )
}

export default CurriculumAccordionItem